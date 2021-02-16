FROM docker.io/library/node:14-alpine AS builder
WORKDIR /build

COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

COPY source source
RUN node_modules/.bin/tsc

RUN rm -rf node_modules && npm ci --production


FROM docker.io/library/node:14-alpine
WORKDIR /app
VOLUME /app/meals

RUN apk --no-cache add bash git openssh-client

ENV NODE_ENV=production

COPY gitconfig /root/.gitconfig
COPY known_hosts /root/.ssh/known_hosts
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/dist ./

HEALTHCHECK --interval=5m \
    CMD bash -c '[[ $(find . -maxdepth 1 -name ".last-successful-run" -mmin "-250" -print | wc -l) == "1" ]]'

CMD node --unhandled-rejections=strict -r source-map-support/register index.js
