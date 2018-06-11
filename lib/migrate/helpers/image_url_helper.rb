# frozen_string_literal: true

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
end
