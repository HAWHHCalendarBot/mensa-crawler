#!/usr/bin/env bash
set -e

curl "https://www.studierendenwerk-hamburg.de/speiseplan/?t=next_day" > list.html
