# frozen_string_literal: true

require "tempfile"
require "mini_magick"
require "image_processing/mini_magick"

module Screenshots
  def self.screenshot_tweet(tweet_uri)
    # Big window height so we can screenshot also tweets with longer content like photos
    browser = Ferrum::Browser.new(timeout: 10, window_size: [1024, 1200])
    browser.goto(tweet_uri)

    # It takes a moment to render the tweet and browser.network.wait_for_idle does not help
    sleep(2)

    tmpfile = Tempfile.new("demagog-tweetscreenshot-")

    # We unfortunately cannot really be more specific with the selector
    browser.screenshot(path: tmpfile.path, format: "png", selector: "article[role=\"article\"]")

    has_some_retweets = !browser.at_css("a[href*=\"retweets\"]").nil?
    has_some_likes = !browser.at_css("a[href*=\"likes\"]").nil?

    browser.quit

    image = MiniMagick::Image.open(tmpfile.path)
    image_width = image.dimensions[0]
    image_height = image.dimensions[1]

    # First 50px at the bottom we are cropping are the actions, second
    # 50px are the retweets and likes, which are displayed only when there
    # are any
    crop_bottom_px = (has_some_retweets || has_some_likes) ? 100 : 50

    result_file_path = "#{Rails.root}/storage/tweet-#{SecureRandom.alphanumeric(10)}.png"

    ImageProcessing::MiniMagick
      .source(tmpfile.path)
      .loader(page: 0)
      .crop("#{image_width}x#{image_height - crop_bottom_px}")
      .call(destination: result_file_path)

    tmpfile.close
    tmpfile.unlink

    result_file_path
  end
end
