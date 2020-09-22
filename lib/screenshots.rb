# frozen_string_literal: true

require "tempfile"
require "mini_magick"

module Screenshots
  def self.screenshot_tweet(tweet_uri, options)
    with_attachment = options.key?(:with_attachment) ? options[:with_attachment] : true

    # Big window height so we can screenshot also tweets with longer content like photos
    browser = Ferrum::Browser.new(timeout: 10, window_size: [1024, 1200])
    browser.goto(tweet_uri)

    # It takes a moment to render the tweet and browser.network.wait_for_idle does not help
    sleep(5)

    unless with_attachment
      # If the tweet has a photo, video or a card, remove it, we don't want that in the screenshot
      browser.evaluate("(() => { const el = document.querySelector('a[href*=\"photo\"]'); el && el.parentNode.parentNode.parentNode.removeChild(el.parentNode.parentNode); })()")
      browser.evaluate("(() => { const el = document.querySelector('div[data-testid*=\"card\"]'); el && el.parentNode.parentNode.parentNode.removeChild(el.parentNode.parentNode); })()")
      browser.evaluate("(() => { const el = document.querySelector('div[data-testid*=\"videoPlayer\"]'); el && el.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(el.parentNode.parentNode.parentNode.parentNode); })()")
    end

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

    image.crop "#{image_width}x#{image_height - crop_bottom_px}+0+0"

    file_name = "tweet-#{SecureRandom.alphanumeric(10)}.png"
    file_path = "#{Rails.root}/storage/#{file_name}"

    image.write file_path

    tmpfile.close
    tmpfile.unlink

    { name: file_name, path: file_path, mime: "image/png" }
  end
end
