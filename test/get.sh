#!/usr/bin/env bash
set -eux

curl "https://www.stwhh.de/speiseplan/?t=next_day" > list.html
