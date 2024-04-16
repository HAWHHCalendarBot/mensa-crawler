use std::collections::HashMap;
use std::thread::sleep;
use std::time::Duration;

use crate::meal::{Meal, Meta};
use serde::Serialize;
use serde_json::ser::PrettyFormatter;
use serde_json::Serializer;

mod git;
mod http;
mod meal;
mod parse;

fn main() {
    let mut errors: usize = 0;
    loop {
        println!("time for another update");
        if let Err(err) = once() {
            eprintln!("ERROR: {err}");
            errors += 1;
            assert!(errors < 3, "failed {errors} times in a row");
        } else {
            errors = 0;
        }

        println!("now sleep 70 minutes...\n\n");
        sleep(Duration::from_secs(60 * 70));
    }
}

fn once() -> anyhow::Result<()> {
    const URL_THIS_WEEK: &str = "https://www.stwhh.de/speiseplan/?t=this_week";
    const URL_NEXT_WEEK: &str = "https://www.stwhh.de/speiseplan/?t=next_week";

    git::pull()?;

    println!("this week...");
    let html = http::get_text(URL_THIS_WEEK)?;
    let meals = parse::parse(&html);
    let this_week = meals.values().flatten().count();
    write_meals(meals)?;

    println!("next week...");
    let html = http::get_text(URL_NEXT_WEEK)?;
    let meals = parse::parse(&html);
    let next_week = meals.values().flatten().count();
    write_meals(meals)?;

    let total = this_week + next_week;
    println!("Got meals:{this_week:>4} +{next_week:>4} ={total:>4}");
    anyhow::ensure!(total > 0, "no meals found");

    git::commit_and_push()?;
    Ok(())
}

fn write_meals(mut meals: HashMap<Meta, Vec<Meal>>) -> anyhow::Result<()> {
    for (meta, meals) in &mut meals {
        let path = meta.get_path();
        let folder = path.parent().expect("always has a folder");
        std::fs::create_dir_all(folder)?;

        meals.sort_by_key(|meal| meal.name.clone());
        meals.sort_by_key(|meal| meal.additives.len());
        #[allow(clippy::min_ident_chars)]
        meals.sort_by(|a, b| a.prices.partial_cmp(&b.prices).unwrap());

        if meals.is_empty() {
            // Don't write "empty" files
            if path.exists() {
                // Delete "empty" files
                // Happens when the mensa closes but was planned to be open before
                std::fs::remove_file(path)?;
            }
        } else {
            let formatter = PrettyFormatter::with_indent(b"\t");
            let mut serializer = Serializer::with_formatter(Vec::new(), formatter);
            meals.serialize(&mut serializer)?;
            let contents = String::from_utf8(serializer.into_inner())
                .expect("serde_json generates only valid Utf-8");
            std::fs::write(path, contents + "\n")?;
        }
    }

    Ok(())
}
