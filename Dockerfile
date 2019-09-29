FROM ruby:2.6.3-alpine3.9

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

RUN bundle install --without development test

RUN npm install -g yarn

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN PRODUCTION_DATABASE_URL=postgresql:doesnt_exist SECRET_KEY_BASE=does-not-matter bundle exec rails assets:precompile && \
  yarn cache clean && \
  rm -rf node_modules

FROM ruby:2.6.3-alpine3.9
LABEL maintainer="bohac.v@gmail.com"

ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true
ENV RAILS_LOG_TO_STDOUT true

RUN apk --no-cache add ca-certificates postgresql-dev nodejs tzdata

WORKDIR /app

COPY --from=0 /usr/local/bundle/ /usr/local/bundle/
COPY --from=0 /app .

EXPOSE 3000
CMD ["bin/rails", "server", "-b", "0.0.0.0"]
