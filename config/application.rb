# frozen_string_literal: true

require_relative "boot"

require "rails/all"
require "sentry-raven"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Demagog
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.autoload_paths << Rails.root.join("app/graphql/utils")

    # Enable CORS to /graphql resource from anywhere
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins "*"
        resource "/graphql", headers: :any, methods: [:get, :post, :options]
      end
    end

    # Needed to be able to use JSON type in GraphQL
    config.action_controller.permit_all_parameters = true

    # Setup error logging to Sentry.io
    Raven.configure do |config|
      config.dsn = "https://36809645e61d4c28a05e4b0dd678c5d7:8ea9811047984128855cd2043944b744@sentry.io/1234606"
    end
  end
end
