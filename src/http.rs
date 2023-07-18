use lazy_regex::Lazy;
use ureq::{Agent, Request};

const USER_AGENT: &str = concat!(
    env!("CARGO_PKG_NAME"),
    "/",
    env!("CARGO_PKG_VERSION"),
    " ",
    env!("CARGO_PKG_REPOSITORY"),
);

fn get_with_headers(url: &str) -> Request {
    static AGENT: Lazy<Agent> =
        Lazy::new(|| ureq::AgentBuilder::new().user_agent(USER_AGENT).build());

    AGENT
        .get(url)
        .set("from", "calendarbot-mensa-crawler@hawhh.de")
}

pub fn get_text(url: &str) -> anyhow::Result<String> {
    let content = get_with_headers(url).call()?.into_string()?;
    Ok(content)
}
