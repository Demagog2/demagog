FROM ruby:2.6.3-alpine3.9
MAINTAINER Vaclav Bohac <bohac.v@gmail.com>

ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true
ENV RAILS_LOG_TO_STDOUT true

RUN apk add --no-cache --update build-base \
                                linux-headers \
                                git \
                                postgresql-dev \
                                nodejs \
                                nodejs-npm \
                                tzdata && \
                                gem install bundler

WORKDIR /app

COPY Gemfile .
COPY Gemfile.lock .

RUN bundle install --without development test

COPY package.json .
COPY yarn.lock .

COPY . .

RUN npm install -g yarn && yarn install && \
  DATABASE_URL=postgresql:doesnt_exist SECRET_KEY_BASE=does-not-matter bundle exec rails assets:precompile && \
  yarn cache clean && \
  rm -rf node_modules

EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]
