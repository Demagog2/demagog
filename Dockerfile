FROM ruby:2.7.6-alpine

ENV RAILS_ENV production

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

RUN bundle install

RUN npm install -g yarn

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN PRODUCTION_DATABASE_URL=postgresql:doesnt_exist SECRET_KEY_BASE=does-not-matter bundle exec rails assets:precompile
RUN yarn cache clean
RUN rm -rf node_modules

FROM ruby:2.7.6-alpine
LABEL maintainer="bohac.v@gmail.com"

RUN apk --no-cache add ca-certificates postgresql-dev nodejs tzdata

ENV BUNDLE_USER_HOME=/tmp

WORKDIR /app

COPY --from=0 /usr/local/bundle/ /usr/local/bundle/
COPY --from=0 /app .

EXPOSE 3000
CMD ["bin/rails", "server", "-b", "0.0.0.0"]
