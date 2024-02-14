# frozen_string_literal: true

require_relative "boot"

require "rails/all"

require "elasticsearch/rails/instrumentation"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Demagog
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w(assets tasks))

    # Enable CORS to /graphql resource from anywhere
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins "*"
        resource "/graphql", headers: :any, methods: %i[get post options]
      end
    end

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.

    # Needed to be able to use JSON type in GraphQL
    config.action_controller.permit_all_parameters = true

    # We are using dynamic error pages,
    # see https://mattbrictson.com/dynamic-rails-error-pages
    # or https://pooreffort.com/blog/custom-rails-error-pages/
    config.exceptions_app = self.routes

    # Default time zone
    config.time_zone = "Europe/Prague"
  end
end
