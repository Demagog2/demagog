# frozen_string_literal: true

require "mysql2"
require "uri"
require_relative "../migrate/migration_manager"

namespace :migration do
  desc "Run migration"
  task run: :environment do
    config = URI.parse ENV["LEGACY_DATABASE_URL"]

    connection = Mysql2::Client.new(username: config.user,
      password: config.password,
      port: config.port,
      database: config.path.sub(%r{^/}, ""),
      host: config.hostname)

    MigrationManager.new(connection).perform
  end
end
