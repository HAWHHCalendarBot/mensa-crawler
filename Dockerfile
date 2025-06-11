FROM docker.io/library/rust:1-bookworm AS builder
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


FROM docker.io/library/debian:bookworm-slim AS final
RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get install -y git \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* /var/cache/* /var/log/*

WORKDIR /app
VOLUME /app/meals

COPY gitconfig /root/.gitconfig
COPY known_hosts /root/.ssh/known_hosts

COPY --from=builder /build/target/release/mensa-crawler /usr/local/bin/
ENTRYPOINT ["mensa-crawler"]
