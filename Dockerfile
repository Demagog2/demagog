FROM ruby:2.5.3-slim
MAINTAINER Vaclav Bohac <bohac.v@gmail.com>

RUN apt-get -y update && \
      apt-get install --fix-missing --no-install-recommends -qq -y \
        build-essential \
        curl gnupg \
        git-all \
        default-libmysqlclient-dev && \
      curl -sL https://deb.nodesource.com/setup_10.x | bash -  && \
      apt-get update  && \
      apt-get install -y nodejs && \
      apt-get clean && \
      rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /app

RUN gem install bundler

COPY Gemfile .
COPY Gemfile.lock .

RUN bundle install

COPY package.json .
COPY yarn.lock .

RUN npm install -g yarn
RUN yarn install

COPY . .
