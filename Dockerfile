FROM mhart/alpine-node:11.9.0

WORKDIR /code

ENV VERSION=1
RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      chromium@edge \
      harfbuzz@edge \
      nss@edge \
      joe curl git bash

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV LANG=C.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=C.UTF-8

ADD package.json .
ADD yarn.lock .

RUN yarn install

ADD . .

CMD yarn run server
