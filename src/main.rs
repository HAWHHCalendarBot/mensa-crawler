use std::collections::HashMap;
use std::thread::sleep;
use std::time::Duration;

use meal::{Meal, Meta};

mod git;
mod http;
mod meal;
mod parse;

fn main() {
    let agent = ureq::AgentBuilder::new().build();
    loop {
        println!("time for another update");
        if let Err(err) = once(&agent) {
            eprintln!("ERROR: {}", err);
        }

        println!("now sleep 70 minutes...\n\n");
        sleep(Duration::from_secs(60 * 70));
    }
}

fn once(agent: &ureq::Agent) -> anyhow::Result<()> {
    const URL_THIS_WEEK: &str = "https://www.studierendenwerk-hamburg.de/speiseplan/?t=this_week";
    const URL_NEXT_WEEK: &str = "https://www.studierendenwerk-hamburg.de/speiseplan/?t=next_week";

    git::pull()?;

    println!("this week...");
    let html = http::get_text(agent, URL_THIS_WEEK)?;
    let meals = parse::parse(&html);
    let this_week = meals.values().flatten().count();
    write_meals(meals)?;

    println!("next week...");
    let html = http::get_text(agent, URL_NEXT_WEEK)?;
    let meals = parse::parse(&html);
    let next_week = meals.values().flatten().count();
    write_meals(meals)?;

    let total = this_week + next_week;
    println!("Got meals:{:>4} +{:>4} ={:>4}", this_week, next_week, total);
    if total == 0 {
        return Err(anyhow::anyhow!("no meals found"));
    }

    git::commit_and_push()?;
    std::fs::write(".last-successful-run", "")?;
    Ok(())
}

fn write_meals(mut meals: HashMap<Meta, Vec<Meal>>) -> anyhow::Result<()> {
    for (meta, meals) in &mut meals {
        let path = meta.get_path();
        let folder = path.parent().expect("always has a folder");
        std::fs::create_dir_all(folder)?;

        meals.sort_by_key(|o| o.name.to_string());
        meals.sort_by_key(|o| o.additives.len());
        meals.sort_by(|a, b| a.prices.partial_cmp(&b.prices).unwrap());

        if meals.is_empty() {
            // Don't write "empty" files
            if path.exists() {
                // Delete "empty" files
                // Happens when the mensa closes but was planned to be open before
                std::fs::remove_file(path)?;
            }
        } else {
            let contents = serde_json::to_string_pretty(&meals)?;
            std::fs::write(path, contents + "\n")?;
        }
    }

    Ok(())
}
