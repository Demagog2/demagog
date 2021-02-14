# frozen_string_literal: true

require "logger"

logger = Logger.new(STDOUT)
logger.level = Logger::INFO

namespace :active_storage do
  desc "Ensures all active storage files are mirrored"
  task mirror_all: [:environment] do
    blobs = ActiveStorage::Blob.all

    logger.info "Migrating #{blobs.size} blobs"

    ActiveStorage::Blob.all.each_with_index do |blob, index|
      mirror = blob.service.mirrors.first
      if mirror.exist? blob.key
        logger.info "#{index}: #{blob.key} skipped"

        next
      end

      blob.mirror_later

      logger.info "#{index}: #{blob.key} scheduled for mirroring"

      Kernel.sleep(1)
    end

    logger.info "Done"
  end
end
