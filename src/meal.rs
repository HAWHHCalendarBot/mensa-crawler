use std::collections::BTreeMap;
use std::path::{Path, PathBuf};

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

#[derive(Debug, Hash, PartialEq, Eq)]
pub struct Meta {
    pub canteen: String,
    pub date: NaiveDate,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "PascalCase")]
pub struct Meal {
    pub name: String,
    pub category: String,
    pub date: NaiveDate,
    pub additives: BTreeMap<String, String>,

    #[serde(flatten)]
    pub prices: Prices,

    #[serde(flatten)]
    pub contents: Contents,
}

#[allow(clippy::struct_excessive_bools)]
#[derive(Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "PascalCase")]
pub struct Contents {
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub alcohol: bool,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub beef: bool,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub fish: bool,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub game: bool,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub gelatine: bool,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub lactose_free: bool,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub lamb: bool,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub pig: bool,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub poultry: bool,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub vegan: bool,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub vegetarian: bool,
}

#[allow(clippy::struct_field_names)]
#[derive(Debug, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(rename_all = "PascalCase")]
pub struct Prices {
    pub price_attendant: f32,
    pub price_guest: f32,
    pub price_student: f32,
}

impl std::fmt::Debug for Contents {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("Contents { ")?;
        if self.alcohol {
            f.write_str("Alcohol ")?;
        }
        if self.beef {
            f.write_str("Beef ")?;
        }
        if self.fish {
            f.write_str("Fish ")?;
        }
        if self.game {
            f.write_str("Game ")?;
        }
        if self.gelatine {
            f.write_str("Gelatine ")?;
        }
        if self.lactose_free {
            f.write_str("LactoseFree ")?;
        }
        if self.lamb {
            f.write_str("Lamb ")?;
        }
        if self.pig {
            f.write_str("Pig ")?;
        }
        if self.poultry {
            f.write_str("Poultry ")?;
        }
        if self.vegan {
            f.write_str("Vegan ")?;
        }
        if self.vegetarian {
            f.write_str("Vegetarian ")?;
        }
        f.write_str("}")
    }
}

impl Meta {
    pub fn get_path(&self) -> PathBuf {
        let canteen = self.canteen.replace('-', " ").replace("&amp;", "&");
        let date = self.date.format("%Y/%m/%d.json").to_string();
        Path::new("meals").join(canteen).join(date)
    }
}

#[test]
fn meta_path_works() {
    let meta = Meta {
        canteen: "Cafe-Shop ABC".to_owned(),
        date: chrono::NaiveDate::from_ymd_opt(2021, 8, 1).unwrap(),
    };
    let path = meta.get_path();
    let path = path.to_str().unwrap();
    assert_eq!(path, "meals/Cafe Shop ABC/2021/08/01.json");
}

#[test]
fn content_debug_works() {
    let example = Contents {
        vegan: true,
        lactose_free: true,
        ..Contents::default()
    };
    let output = format!("{example:?}");
    assert_eq!(output, "Contents { LactoseFree Vegan }");
}
