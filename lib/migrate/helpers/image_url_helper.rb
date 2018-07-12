# frozen_string_literal: true

require "fileutils"

class ImageUrlHelper
  def self.absolute_url(path)
    image_service_url = ENV["DEMAGOG_IMAGE_SERVICE_URL"]

    # On production and staging DEMAGOG_IMAGE_SERVICE_URL is set to
    # empty string because of the nginx configuration, therefore we supply
    # hardcoded image service url here.
    if image_service_url.empty?
      image_service_url = "http://legacy.demagog.cz"
    end

    image_service_url + path
  end

  def self.open_image(path)
    absolute_url = self.absolute_url(path)

    if ENV["MIGRATION_IMAGE_CACHE"]
      # Expecting image cache path to be without last slash,
      # e.g. /Users/janvlcek/.demagog_image_cache
      cache_dir_path = "#{ENV["MIGRATION_IMAGE_CACHE"]}/"
      cache_file_path = "#{cache_dir_path}#{path.gsub(/\//, '__')}"

      # Checking also for empty file with zero?, because when the images
      # migration ends in the middle, cache file might end up empty, which
      # then breaks next migration run
      cache_hit = File.exist?(cache_file_path) && !File.zero?(cache_file_path)

      unless cache_hit
        FileUtils.mkdir_p cache_dir_path
        File.open(cache_file_path, "wb") do |file|
          p path
          p absolute_url
          file << open(absolute_url).read
        end
      end

      open(cache_file_path) do |file|
        yield file
      end

      return
    end

    open(absolute_url) do |file|
      yield file
    end
  end
end
