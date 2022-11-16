# mensa-crawler

> Crawls the canteen data of student canteens in Hamburg

# Container Usage

The container expects some SSH Key with access to the mensa-data repo.
They need to be in the `/root/.ssh` folder.

For example with docker swarm this might look like this:

```yaml
secrets:
  mensa-data-ssh-key:
    file: secrets/id_ed25519
  mensa-data-ssh-key-pub:
    file: secrets/id_ed25519.pub

volumes:
  mensa-data-ssh:

services:
  mensa-crawler:
    image: ghcr.io/hawhhcalendarbot/mensa-crawler:3
    volumes:
      - mensa-data-ssh:/app/meals
    secrets:
      - source: mensa-data-ssh-key
        target: /root/.ssh/id_ed25519
        mode: 0400
      - source: mensa-data-ssh-key-pub
        target: /root/.ssh/id_ed25519.pub
        mode: 0444
```
