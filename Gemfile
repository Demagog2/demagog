# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Load variables from .env file
gem "dotenv-rails"

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "~> 5.1.4"
# Add possibility for bulk insert to Active Record models
gem "bulk_insert"
# Use MySQL as the database for Active Record
gem "mysql2"
# Use Unicorn as the app server
gem "unicorn"
# Use SCSS for stylesheets
gem "sass-rails", "~> 5.0"
# Use Uglifier as compressor for JavaScript assets
gem "uglifier", ">= 1.3.0"
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby
# Add foundation CSS framework
gem "foundation-rails", "~> 5.5.2"
# Add gem for paging
gem "kaminari"
# Add webpack support
gem "webpacker", "~> 3.0"
# Add graphql support
gem "graphql"
# Allow CORS setup
gem "rack-cors", require: "rack/cors"

# Use CoffeeScript for .coffee assets and views
gem "coffee-rails", "~> 4.2"
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem "turbolinks", "~> 5"
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem "jbuilder", "~> 2.5"
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use friendly to generate slugs
gem "friendly_id", "~> 5.1.0"

# Enables env. specific configuration
gem "config"

# Use redis for store layer
gem "redis", "~> 4.0", ">= 4.0.1"

# Add skylight profiler
# gem "skylight"

# Use Capistrano for deployment
group :development do
  gem "capistrano", require: false
  gem "capistrano-rvm", require: false
  gem "capistrano-nvm", require: false
  gem "capistrano-rails", require: false
  gem "capistrano-bundler", require: false
  gem "capistrano3-unicorn", require: false
end

group :development, :test do
  gem "rubocop-rails"
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem "capybara", "~> 2.13"
  gem "selenium-webdriver"

  # Tools for autorunning tests
  gem "guard"
  gem "guard-minitest"
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem "web-console", ">= 3.3.0"
  gem "listen", ">= 3.0.5", "< 3.2"
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem "graphiql-rails", "1.4.4"
