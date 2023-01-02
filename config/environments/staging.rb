# frozen_string_literal: true

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true
  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present?
  config.assets.compile = false
  config.action_controller.default_url_options = { protocol: "https" }
  config.active_storage.service = :amazon
  config.log_level = :info
  config.lograge.enabled = true
  config.lograge.formatter = Lograge::Formatters::Json.new
  config.log_tags = [ :request_id ]
  config.cache_store = :redis_cache_store, { url: ENV["REDIS_URL"] }
  config.session_store :cache_store, key: ENV["APP_SESSION_KEY"]
  config.i18n.fallbacks = true
  config.active_support.deprecation = :notify
  config.active_record.dump_schema_after_migration = false
end
