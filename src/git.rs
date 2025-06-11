use std::path::Path;
use std::process::Command;

use anyhow::{Context as _, anyhow};

fn command(args: &[&str]) -> anyhow::Result<()> {
    let status = Command::new("git")
        .args(args)
        .current_dir("meals")
        .status()
        .context("failed git command")?;

    if status.success() {
        Ok(())
    } else {
        Err(anyhow!(
            "failed git command. Status code {status}. git {args:?}"
        ))
    }
}

pub fn pull() -> anyhow::Result<()> {
    if Path::new("meals/.git").exists() {
        command(&["pull", "--ff-only"])
    } else {
        let status = Command::new("git")
            .arg("clone")
            .arg("-q")
            .args(["--depth", "1"])
            .arg("git@github.com:HAWHHCalendarBot/mensa-data.git")
            .arg("meals")
            .status()
            .context("failed to clone repo")?;

        if status.success() {
            Ok(())
        } else {
            Err(anyhow!("failed to clone/pull. Status code {status}"))
        }
    }
}

#[expect(dead_code)]
fn push() -> anyhow::Result<()> {
    command(&["push"])
}

fn commit() -> anyhow::Result<()> {
    command(&[
        "commit",
        "-m",
        "update",
        "--no-gpg-sign",
        "--author",
        "mensa-crawler <calendarbot-mensa-crawler@hawhh.de>",
    ])
}

fn add_all() -> anyhow::Result<()> {
    command(&["add", "-A"])
}

pub fn commit_and_push() -> anyhow::Result<()> {
    add_all()?;

    // "nothing to commit" errors. Maybe handle in a better way my checking stdout.
    drop(commit());

    #[cfg(not(debug_assertions))]
    push()?;

    Ok(())
}
