FROM node:14-alpine
WORKDIR /build

COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

COPY source source
RUN node_modules/.bin/tsc

RUN rm -rf node_modules && npm ci --production


FROM node:14-alpine
WORKDIR /app
VOLUME /app/meals

RUN apk --no-cache add bash git openssh-client

ENV NODE_ENV=production

COPY gitconfig /root/.gitconfig
COPY known_hosts /root/.ssh/known_hosts
COPY --from=0 /build/node_modules ./node_modules
COPY --from=0 /build/dist ./

HEALTHCHECK --interval=5m \
    CMD bash -c '[[ $(find . -maxdepth 1 -name ".last-successful-run" -mmin "-250" -print | wc -l) == "1" ]]'

CMD node index.js
