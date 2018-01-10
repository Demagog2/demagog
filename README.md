# README

Political fact checking website. For more information see http://demagog.cz/o-nas (in czech).

### Ruby version

2.4.1

## Configuration

Site configuration is done via .env file (see dotenv project).

```
// .env
DEMAGOG_IMAGE_SERVICE_URL=https://pacific-meadow-53023.herokuapp.com
MIGRATION_DATABASE_URL=mysql2://username:password@server/database
```

## Dev setup from legacy DB

0. Install rails and yarn
1. Clone repo
2. `bundle install`
3. `yarn install`
4. Add image service into .env (as seen above)
5. Set up MySQL DB, add credentials to .env (DB_USERNAME, DB_PASSWORD, DB_HOST)
6. Prepare local legacy DB on MySQL, add its URL into .env as MIGRATION_DATABASE_URL
7. Run DB migration `rails db:drop db:create db:migrate migration:run`
8. `rails server`

### Services (job queues, cache servers, search engines, etc.)

#### Server for requesting static assets from legacy server

HTTP server that upon request downloads an image from the legacy server and caches it locally.

For more information see https://github.com/vaclavbohac/demagog-image-service

### Migration from legacy DB

```sh
RAILS_ENV=migration bin/rails db:drop db:create db:migrate migration:run
```

### Deployment instructions

Deploy to production:
```sh
cap production deploy
```

Stop production unicorn:
```sh
cap production rvm:hook unicorn:reload
```

Reload production unicorn:
```sh
cap production rvm:hook unicorn:reload
```

Stop production unicorn:
```sh
cap production rvm:hook unicorn:stop
```

Start production unicorn:
```sh
cap production rvm:hook unicorn:start
```
