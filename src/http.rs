use ureq::http::HeaderValue;
use ureq::http::header::{FROM, USER_AGENT};

const FROM_VALUE: &str = "calendarbot-mensa-crawler@hawhh.de";
const USER_AGENT_VALUE: &str = concat!(
    env!("CARGO_PKG_NAME"),
    "/",
    env!("CARGO_PKG_VERSION"),
    " ",
    env!("CARGO_PKG_REPOSITORY"),
);

pub fn get_text(url: &str) -> Result<String, ureq::Error> {
    ureq::get(url)
        .header(FROM, HeaderValue::from_static(FROM_VALUE))
        .header(USER_AGENT, HeaderValue::from_static(USER_AGENT_VALUE))
        .call()?
        .into_body()
        .read_to_string()
}
