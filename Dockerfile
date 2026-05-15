FROM docker.io/library/rust:1-trixie AS builder
WORKDIR /build
RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

COPY Cargo.toml Cargo.lock ./

# cargo needs a dummy src/lib.rs to compile the dependencies
RUN mkdir -p src \
	&& touch src/lib.rs \
	&& cargo build --release --locked \
	&& rm -rf src

COPY . ./
RUN cargo build --release --locked --offline


FROM docker.io/library/debian:trixie-slim AS final
RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get install -y git \
	&& apt-get clean \
	&& groupadd --system --gid 923 runner \
	&& useradd --system --uid 923 --gid 923 --create-home runner \
	&& rm -rf /etc/*- /var/lib/apt/lists/* /var/cache/* /var/log/*

WORKDIR /app
VOLUME /app/meals

COPY --chown=runner gitconfig /home/runner/.gitconfig
COPY --chown=runner known_hosts /home/runner/.ssh/known_hosts

COPY --from=builder /build/target/release/mensa-crawler /usr/local/bin/

USER runner
ENTRYPOINT ["mensa-crawler"]
