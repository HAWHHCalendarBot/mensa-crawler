use std::collections::{BTreeMap, HashMap};

use chrono::NaiveDate;
use lazy_regex::{lazy_regex, Regex};
use once_cell::sync::Lazy;
use scraper::{ElementRef, Html, Selector};

use crate::meal::{Contents, Meal, Meta, Prices};

pub fn parse(html: &str) -> HashMap<Meta, Vec<Meal>> {
    static LOCATION_SELECTOR: Lazy<Selector> =
        Lazy::new(|| Selector::parse("div[data-location-id]").unwrap());
    static TITLE_SELECTOR: Lazy<Selector> =
        Lazy::new(|| Selector::parse(".mensainfo__title").unwrap());
    static DATE_SELECTOR: Lazy<Selector> =
        Lazy::new(|| Selector::parse("div[data-timestamp]").unwrap());
    static CATEGORY_SELECTOR: Lazy<Selector> =
        Lazy::new(|| Selector::parse(".menulist__categorywrapper").unwrap());
    static CATEGORY_HEADER_SELECTOR: Lazy<Selector> = Lazy::new(|| Selector::parse("h5").unwrap());
    static MEAL_SELECTOR: Lazy<Selector> = Lazy::new(|| Selector::parse(".singlemeal").unwrap());
    let mut result: HashMap<Meta, Vec<Meal>> = HashMap::new();

    let html = Html::parse_document(html);
    let canteens = html.select(&LOCATION_SELECTOR);
    for location_html in canteens {
        let canteen = location_html
            .select(&TITLE_SELECTOR)
            .next()
            .expect("canteen has no name")
            .inner_html();
        dbg!(&canteen);

        let date_parts = location_html.select(&DATE_SELECTOR);
        for date_html in date_parts {
            let date = date_html
                .value()
                .attr("data-timestamp")
                .expect("selected by attribute")
                .parse::<NaiveDate>()
                .expect("date not formatted like a NaiveDate");

            let meta = Meta {
                canteen: canteen.to_string(),
                date,
            };
            let result = result.entry(meta).or_default();

            let categories = date_html.select(&CATEGORY_SELECTOR);
            for category_html in categories {
                let category = category_html
                    .select(&CATEGORY_HEADER_SELECTOR)
                    .map(|o| o.inner_html().trim().to_string())
                    .next()
                    .expect("a category without a title?");

                let meals = category_html.select(&MEAL_SELECTOR);
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

fn meal(html: &ElementRef, category: String, date: NaiveDate) -> Option<Meal> {
    static SELECTOR: Lazy<Selector> =
        Lazy::new(|| Selector::parse(".singlemeal__headline").unwrap());
    let name = html
        .select(&SELECTOR)
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
    static SELECTOR: Lazy<Selector> =
        Lazy::new(|| Selector::parse("span.singlemeal__info").unwrap());
    let contents = html
        .select(&SELECTOR)
        .map(|o| o.inner_html().trim().to_string())
        .filter(|o| o.ends_with(',') && o.contains(" = "))
        .map(|o| o[0..o.len() - 1].trim().to_string());
    let mut result = BTreeMap::new();
    for content in contents {
        let splitted = content.split(" = ").collect::<Vec<_>>();
        if let [key, value] = splitted.as_slice() {
            result.insert((*key).to_string(), (*value).to_string());
        }
    }
    result
}

#[allow(clippy::non_ascii_literal)]
fn prices_of_meal(html: &ElementRef) -> Option<Prices> {
    static PRICE: Lazy<Regex> = lazy_regex!(r"(\d+,\d\d) €");

    let html = html.html();
    let mut captures = PRICE.captures_iter(&html);
    let price_student = euro_to_float(&captures.next()?[1])?;
    let price_attendant = euro_to_float(&captures.next()?[1])?;
    let price_guest = euro_to_float(&captures.next()?[1])?;
    Some(Prices {
        price_attendant,
        price_guest,
        price_student,
    })
}

fn contents_of_meal(html: &ElementRef) -> Contents {
    static SELECTOR: Lazy<Selector> =
        Lazy::new(|| Selector::parse("span[title] img[src]").unwrap());
    let contents = html
        .select(&SELECTOR)
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
    float_eq::assert_float_eq!(result, 1.23, abs <= 0.001);
}

#[test]
fn testdata() {
    let html = include_str!("../test/list.html");
    let result = parse(html);

    let total = result.values().flatten().count();
    assert_eq!(total, 106);
}

#[test]
fn additives_work() {
    let html = Html::parse_fragment(include_str!("../test/singlemeal.html"));
    let additives = additives_of_meal(&html.root_element());
    assert_eq!(3, additives.len());
    assert_eq!(additives["Gl"], "glutenhaltiges Getreide und daraus hergestellte Erzeugnisse (z. B. Weizen, Roggen, Gerste etc.)");
    assert_eq!(additives["Ei"], "Ei und Eierzeugnisse");
    assert_eq!(
        additives["La"],
        "Milch und Milcherzeugnisse (einschl. Laktose)"
    );
}

#[test]
fn prices_work() {
    let html = Html::parse_fragment(include_str!("../test/singlemeal.html"));
    let prices = prices_of_meal(&html.root_element()).unwrap();
    dbg!(&prices);
    float_eq::assert_float_eq!(prices.price_student, 1.5, abs <= 0.001);
    float_eq::assert_float_eq!(prices.price_attendant, 2.7, abs <= 0.001);
    float_eq::assert_float_eq!(prices.price_guest, 3.4, abs <= 0.001);
}

#[test]
fn contents_work() {
    let html = Html::parse_fragment(include_str!("../test/singlemeal.html"));
    let contents = contents_of_meal(&html.root_element());
    dbg!(&contents);
    let expected = Contents {
        vegetarian: true,
        ..Contents::default()
    };
    assert_eq!(contents, expected);
}

#[test]
fn dailytip_works() {
    let html = Html::parse_fragment(include_str!("../test/dailytip.html"));
    let result = meal(
        &html.root_element(),
        "ABCD".to_string(),
        chrono::NaiveDate::from_ymd_opt(2021, 10, 8).unwrap(),
    )
    .unwrap();
    dbg!(&result);

    assert_eq!(
        result.name,
        "Wir kochen, was Sie lieben..., Currybratwurst (3,4,8,Sf), BBQ-Grill-So\u{df}e (9,Sl,Sf), Pommes Frites (Sf)"
    );

    let additives = result.additives;
    assert_eq!(additives.len(), 6);

    float_eq::assert_float_eq!(result.prices.price_student, 3.4, abs <= 0.001);
    float_eq::assert_float_eq!(result.prices.price_attendant, 4.7, abs <= 0.001);
    float_eq::assert_float_eq!(result.prices.price_guest, 5.9, abs <= 0.001);

    let expected_contents = Contents {
        lactose_free: true,
        pig: true,
        ..Contents::default()
    };
    assert_eq!(result.contents, expected_contents);
}
