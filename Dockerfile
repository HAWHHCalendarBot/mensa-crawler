FROM docker.io/library/node:14-alpine AS builder
WORKDIR /build

COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

COPY source source
RUN node_modules/.bin/tsc


FROM docker.io/library/node:14-alpine AS packages
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --production


FROM docker.io/library/node:14-alpine
WORKDIR /app
VOLUME /app/meals

RUN apk --no-cache add bash git openssh-client

ENV NODE_ENV=production

COPY package.json ./
COPY gitconfig /root/.gitconfig
COPY known_hosts /root/.ssh/known_hosts
COPY --from=packages /build/node_modules ./node_modules
COPY --from=builder /build/dist ./

HEALTHCHECK --interval=5m \
    CMD bash -c '[[ $(find . -maxdepth 1 -name ".last-successful-run" -mmin "-250" -print | wc -l) == "1" ]]'

CMD node --unhandled-rejections=strict -r source-map-support/register index.js
