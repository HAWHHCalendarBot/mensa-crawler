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

RUN apk --no-cache add git openssh-client

ENV NODE_ENV=production

COPY gitconfig /root/.gitconfig
COPY known_hosts /root/.ssh/known_hosts
COPY --from=0 /build/node_modules ./node_modules
COPY --from=0 /build/dist ./

CMD node index.js
