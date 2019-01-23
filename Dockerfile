FROM node:10.15.0-stretch

ENV VERSION=1
RUN apt-get update -y && \
    apt-get install -y \
            apt-transport-https \
            gnupg2 \
            git-core \
            joe \
            curl \
            build-essential \
            chromedriver

RUN curl -s -l https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update -y && \
    apt-get install -y yarn

ENV LANG=C.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=C.UTF-8

