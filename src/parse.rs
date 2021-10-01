use std::collections::{BTreeMap, HashMap};

use chrono::{DateTime, TimeZone, Utc};
use regex::Regex;
use scraper::{ElementRef, Html, Selector};

use crate::meal::{Contents, Meal, Meta, Prices};

pub fn parse(html: &str) -> HashMap<Meta, Vec<Meal>> {
    let location_selector = Selector::parse("div[data-location-id]").unwrap();
    let title_selector = Selector::parse(".mensainfo__title").unwrap();
    let date_selector = Selector::parse("div[data-timestamp]").unwrap();
    let category_selector = Selector::parse(".menulist__categorywrapper").unwrap();
    let category_header_selector = Selector::parse("h5").unwrap();
    let meal_selector = Selector::parse(".singlemeal").unwrap();

    let mut result: HashMap<Meta, Vec<Meal>> = HashMap::new();

    let parsed_html = Html::parse_document(html);

    let canteens = parsed_html
        .select(&location_selector)
        // .map(|o| o.html())
        .collect::<Vec<_>>();

    for location_html in canteens {
        let canteen = location_html
            .select(&title_selector)
            .next()
            .expect("canteen has no name")
            .inner_html();
        dbg!(&canteen);

        let date_parts = location_html.select(&date_selector).collect::<Vec<_>>();
        for date_html in date_parts {
            let date = date_html
                .value()
                .attr("data-timestamp")
                .expect("selected by attribute")
                .parse()
                .expect("date not formatted like a NaiveDate");
            let date = Utc.from_utc_date(&date).and_hms(0, 0, 0);

            let meta = Meta {
                canteen: canteen.to_string(),
                date,
            };
            let result = result.entry(meta).or_default();

            let categories = date_html.select(&category_selector).collect::<Vec<_>>();

            for category_html in categories {
                let category = category_html
                    .select(&category_header_selector)
                    .map(|o| o.inner_html().trim().to_string())
                    .next()
                    .expect("a category without a title?");

                let meals = category_html.select(&meal_selector).collect::<Vec<_>>();

                for meal_html in meals {
                    if let Some(meal) = meal(&meal_html, category.to_string(), date) {
                        result.push(meal);
                    }
                }
            }
        }
    }

    result
}

fn meal(html: &ElementRef, category: String, date: DateTime<Utc>) -> Option<Meal> {
    let name_selector = Selector::parse("h5").unwrap();
    let name = html
        .select(&name_selector)
        .next()?
        .inner_html()
        .trim()
        .to_string();
    Some(Meal {
        name,
        category,
        date,
        additives: additives_of_meal(html),
        prices: prices_of_meal(html)?,
        contents: contents_of_meal(html),
    })
}

fn additives_of_meal(html: &ElementRef) -> BTreeMap<String, String> {
    let selector = Selector::parse("span.singlemeal__info").unwrap();
    let contents = html
        .select(&selector)
        .map(|o| o.inner_html().trim().to_string())
        .filter(|o| o.ends_with(',') && o.contains('='))
        .map(|o| o[0..o.len() - 1].trim().to_string())
        .collect::<Vec<_>>();
    let mut result = BTreeMap::new();
    for content in contents {
        let mut splitted = content.split(" = ");
        let key = splitted.next().unwrap();
        let value = splitted.next().unwrap();
        result.insert(key.to_string(), value.to_string());
    }
    result
}

#[allow(clippy::non_ascii_literal)]
fn prices_of_meal(html: &ElementRef) -> Option<Prices> {
    let html = html.html();
    let re = Regex::new(r#"(\d+,\d\d) €"#).unwrap();
    let mut captures = re.captures_iter(&html);
    Some(Prices {
        price_attendant: euro_to_float(&captures.next()?[1])?,
        price_guest: euro_to_float(&captures.next()?[1])?,
        price_student: euro_to_float(&captures.next()?[1])?,
    })
}

fn contents_of_meal(html: &ElementRef) -> Contents {
    let selector = Selector::parse("span[title] img[src]").unwrap();
    let contents = html
        .select(&selector)
        .filter_map(|o| o.value().attr("src"))
        .filter_map(|o| o.split('/').last())
        .filter_map(|o| o.split('.').next())
        .collect::<Vec<_>>();
    Contents {
        alcohol: contents.contains(&"alc"),
        beef: contents.contains(&"beef"),
        fish: contents.contains(&"fish"),
        game: contents.contains(&"game"),
        gelatine: contents.contains(&"gela"),
        lactose_free: contents.contains(&"lact"),
        lamb: contents.contains(&"lamb"),
        pig: contents.contains(&"pork"),
        poultry: contents.contains(&"poul"),
        vegan: contents.contains(&"vega"),
        vegetarian: contents.contains(&"vege"),
    }
}

fn euro_to_float(euro: &str) -> Option<f32> {
    euro.replace(',', ".").parse().ok()
}

#[test]
fn euro_to_float_works() {
    let result = euro_to_float("1,23").unwrap();
    assert!((result - 1.23).abs() < f32::EPSILON);
}

#[test]
fn testdata() {
    let html = include_str!("../test/list.html");
    let result = parse(html);

    let total = result.values().flatten().count();
    assert_eq!(total, 106);
}
