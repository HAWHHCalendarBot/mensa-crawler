use std::sync::LazyLock;

use ureq::http::header::FROM;
use ureq::Agent;

const USER_AGENT: &str = concat!(
    env!("CARGO_PKG_NAME"),
    "/",
    env!("CARGO_PKG_VERSION"),
    " ",
    env!("CARGO_PKG_REPOSITORY"),
);

pub fn get_text(url: &str) -> Result<String, ureq::Error> {
    static AGENT: LazyLock<Agent> = LazyLock::new(|| {
        Agent::new_with_config(Agent::config_builder().user_agent(USER_AGENT).build())
    });
    let content = AGENT
        .get(url)
        .header(FROM, "calendarbot-mensa-crawler@hawhh.de")
        .call()?
        .into_body()
        .read_to_string()?;
    Ok(content)
}
