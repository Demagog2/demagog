# frozen_string_literal: true

namespace :active_storage do
  desc "Ensures all active storage files are mirrored"

  task mirror_all: [:environment] do
    ActiveStorage::Blob.all.each do |blob|
      blob.service.mirrors.each do |mirror|
        blob.mirror_later unless mirror.exist? blob.key

        Kernel.sleep(1)
      end
    end
  end
end
