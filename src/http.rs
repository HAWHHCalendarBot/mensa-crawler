use anyhow::anyhow;
use ureq::{Agent, Request};

const USER_AGENT: &str = concat!(
    env!("CARGO_PKG_NAME"),
    "/",
    env!("CARGO_PKG_VERSION"),
    " ",
    env!("CARGO_PKG_REPOSITORY"),
);

fn get_with_headers(agent: &Agent, url: &str) -> Request {
    agent
        .get(url)
        .set("user-agent", USER_AGENT)
        .set("from", "mensa-crawler@hawhh.de")
}

pub fn get_text(agent: &Agent, url: &str) -> anyhow::Result<String> {
    get_with_headers(agent, url)
        .call()
        .map_err(|err| anyhow!("failed to get {}", err))?
        .into_string()
        .map_err(|err| anyhow!("failed to read string {} {}", url, err))
}
