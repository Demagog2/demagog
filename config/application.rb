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
    config.load_defaults 6.1

    config.autoload_paths << Rails.root.join("lib")

    # Enable CORS to /graphql resource from anywhere
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins "*"
        resource "/graphql", headers: :any, methods: %i[get post options]
      end
    end

    # Needed to be able to use JSON type in GraphQL
    config.action_controller.permit_all_parameters = true

    # We are using dynamic error pages,
    # see https://mattbrictson.com/dynamic-rails-error-pages
    # or https://pooreffort.com/blog/custom-rails-error-pages/
    config.exceptions_app = self.routes

    # Default time zone
    config.time_zone = "Europe/Prague"

    # Disables the deprecated #to_s override in some Ruby core classes
    # See https://guides.rubyonrails.org/configuring.html#config-active-support-disable-to-s-conversion for more information.
    config.active_support.disable_to_s_conversion = true
  end
end
