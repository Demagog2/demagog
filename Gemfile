# frozen_string_literal: true

ruby "3.1.3"

source "https://rubygems.org"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# WHY ARE WE ADDING VERSIONS OF GEMS?
#
# We are specifying gem versions as exactly as possible in the Gemfile here
# so the project can be also developed on Windows and deployed to Heroku.
#
# When developing on Windows, Gemfile.lock needs x86-mingw32 among platforms
# which then fails to be used on Heroku with error "Removing `Gemfile.lock`
# because it was generated on Windows.". Heroku's recommended solution is to
# add the versions to Gemfile [1].
#
# [1] https://devcenter.heroku.com/articles/bundler-windows-gemfile

# Load variables from .env file
gem "dotenv-rails", "~> 2.7.6"

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "~> 6.1.7"
# Add possibility for bulk insert to Active Record models
# gem "bulk_insert"
# Use Postgresql as the database for Active Record
gem "pg", "~> 1.3.5"
# Use scenic for materilized views
gem "scenic", "~> 1.5.4"

# Use puma as a web server
gem "puma", "~> 5.6.5"

# Use SCSS for stylesheets
gem "sass-rails", "~> 5.1.0"
# Use Uglifier as compressor for JavaScript assets
gem "uglifier", "~> 4.2.0"
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby
# Add gem for paging
gem "kaminari", "~> 1.2.2"
# Add webpack support
gem "webpacker", "~> 5.4.3"
# Add graphql support
gem "graphql", "~> 1.12.24"
# Allow CORS setup
gem "rack-cors", "~> 1.1.1", require: "rack/cors"
# Unified model soft delete API
gem "discard", "~> 1.2.1"
# Active record versioning
gem "paper_trail", "~> 12.2.0"

# Use CoffeeScript for .coffee assets and views
# gem "coffee-rails", "~> 4.2"
#  Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
# gem "turbolinks", "~> 5"
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem "jbuilder", "~> 2.5"
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use friendly to generate slugs
gem "friendly_id", "~> 5.1.0"

# Use meta tags to add SEO tags to the head
gem "meta-tags", "~> 2.16.0"

# Enables env. specific configuration
gem "config", "~> 2.2.1"

# Authentication
gem "devise", "~> 4.8.1"

# Enables devise & omniauth to authenticate against Google OAuth 2
gem "omniauth-google-oauth2", "~> 1.0.0"
gem "omniauth-rails_csrf_protection", "~> 1.0.1"

# Use redis for store layer
gem "redis", "~> 4.1.4"

# Use sidekiq for background jobs
# sidekiq v6 needs redis v4, but we have redis v3 on production, so we need to stick to v5 for now
gem "sidekiq", "~> 7.0.8"

# Use Amazon S3 for active storage for production environment
gem "aws-sdk-s3", "~> 1.106.0", require: false

# Patches security vulnerability CVE-2018-8048
gem "loofah", "~> 2.19.1"

# Patches security vulnerability CVE-2018-3760
gem "sprockets", "~> 3.7.2"

# Patches security vulnerability CVE-2018-1000544
gem "rubyzip", "~> 1.3.0"

# Enable image processing for active storage
gem "image_processing", "~> 1.12.2"

# For migration progress display
gem "ruby-progressbar", "~> 1.11.0"

gem "nokogiri", "~> 1.13.10"

gem "htmlbeautifier", "~> 1.4.2"

# Add skylight profiler
# gem "skylight"

gem "sentry-ruby", "~> 5.7.0"
gem "sentry-rails", "~> 5.7.0"
gem "sentry-sidekiq", "~> 5.7.0"

# Add elasticsearch integration
gem "elasticsearch-model", "~> 7.2.1"
gem "elasticsearch-rails", "~> 7.2.1"
gem "elasticsearch", "~> 7.17.7"

# Posting to Slack
gem "slack-notifier", "~> 2.4.0"

gem "graphlient", "~> 0.5.0"
gem "tty-prompt", "~> 0.23.1"

# Production logging
gem "lograge", "~> 0.11.2"

gem "addressable", "~> 2.8.1"

gem "caxlsx", "~> 3.1.1"
gem "caxlsx_rails", "~> 0.6.2"

gem "ferrum", "~> 0.13"
gem "mini_magick", "~> 4.11.0"

group :development, :test do
  gem "rubocop-rails_config", "~> 1.10.1"
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem "byebug", "~> 11.1.3", platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem "capybara", "~> 2.18.0"
  # gem "selenium-webdriver"

  # Tools for autorunning tests
  gem "guard", "~> 2.18.0"
  gem "guard-minitest", "~> 2.4.6"

  # Fixture replacement
  gem "factory_bot_rails", "~> 5.1.0"

  # For intellisense in editors
  gem "solargraph", "~> 0.45.0"
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem "web-console", "~> 4.2.0"
  gem "listen", "~> 3.7.1"
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring", "~> 2.1.1"
  gem "spring-watcher-listen", "~> 2.0.1"

  gem "guard-livereload", "~> 2.5.2", require: false
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", "~> 1.2022.6", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# graphiql-rails 1.5 and up fails in production, see issue:
# https://github.com/rmosolgo/graphiql-rails/issues/58
gem "graphiql-rails", "~> 1.4.11"

gem "view_component", "~> 2.75.0"
