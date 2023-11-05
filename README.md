# README

Political fact checking website. For more information see http://demagog.cz/o-nas (in czech).

### Ruby version

3.1.4

### Node version

16.20.2

## Setup

Demagog can be run, tested and fully developed in the [docker](https://www.docker.com/) environment

## Setting up database
```
rails db:create db:migrate db:seed
```

## Running tests
```
rails test
yarn jest
```

## Elasticsearch integration

Elasticsearch server is installed by docker-compose and will be running on http://localhost:9200 by default

First run:
```
# It's necessary to use the parameters FORCE=y as it creates the elasticsearch indexes
rails environment elasticsearch:import:all FORCE=y
```

Regular data refresh:
```
rails environment elasticsearch:import:all
```

## Configuration

Site configuration is done via .env file (see dotenv project).

```
// .env
DEMAGOG_IMAGE_SERVICE_URL=https://pacific-meadow-53023.herokuapp.com
LEGACY_DATABASE_URL=mysql2://username:password@server/database

# You can speed up your local full DB migration by setting path to local
# image cache. Images will be downloaded from the image service to the cache
# only once and then the migration will take images from the cache. This
# setting is optional.
MIGRATION_IMAGE_CACHE=/tmp/demagog_image_cache

# S3 keys are needed for non-development environment only
AMAZON_S3_ACCESS_KEY_ID=amazon-access-id
AMAZON_S3_SECRET_ACCESS_KEY=amazon-secret-access-key
AMAZON_S3_REGION=region
AMAZON_S3_BUCKET=bucket-name
AMAZON_S3_ENDPOINT=https://example.com

# Sendgrid SMTP service (only for production)
SENDGRID_USERNAME=sendgrid-username
SENDGRID_PASSWORD=sendgrid-password

# Sentry.io project to log to (only for production)
SENTRY_DSN=sentry-dsn
```

## Dev setup from legacy DB

0. Install rails and yarn
1. Clone repo
2. `bundle install`
3. `yarn install`
4. Add image service into .env (as seen above)
5. Set up MySQL DB, add credentials to .env (DB_USERNAME, DB_PASSWORD, DB_HOST)
6. Prepare local legacy DB on MySQL, add its URL into .env as LEGACY_DATABASE_URL
7. Run DB migration `rails db:drop db:create db:migrate migration:run`
8. `rails server`

Run guard-livereload server with `guard`.

## Generating Apollo flow types

```sh
rails apollo:types
```

### Services (job queues, cache servers, search engines, etc.)

#### Redis server

Redis server is not essential for running https://demagog.cz, but it helps to improve performance

It's used to cache:

* speaker statistics
* speaker statistics for debate (article)
