FROM node:12-alpine
WORKDIR /build

RUN apk --no-cache add krb5-libs

COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

COPY source source
RUN node_modules/.bin/tsc

RUN rm -rf node_modules && npm ci --production


FROM node:12-alpine
WORKDIR /app
VOLUME /root/.ssh
VOLUME /app/meals

RUN apk --no-cache add krb5-libs git openssh-client

ENV NODE_ENV=production

COPY gitconfig /root/.gitconfig
COPY --from=0 /build/node_modules ./node_modules
COPY --from=0 /build/dist ./

CMD node index.js
