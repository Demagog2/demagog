# frozen_string_literal: true

require "mini_magick"
require "base64"

class Admin::ArticleController < ApplicationController
  before_action :authenticate_user!

  skip_before_action :verify_authenticity_token, only: [:generate_illustration_image_for_tweet]

  def generate_illustration_image_for_tweet
    tweet_url = params[:tweet_url]
    with_attachment = params[:with_attachment] == "true"

    screenshot = Screenshots.screenshot_tweet(tweet_url, { with_attachment: })

    background_image = MiniMagick::Image.open("#{Rails.root}/app/assets/images/illustration-tweet-background.png")
    badge_image = MiniMagick::Image.open("#{Rails.root}/app/assets/images/illustration-tweet-badge.png")
    tweet_image = MiniMagick::Image.open(screenshot[:path])

    background_image_width = background_image.dimensions[0]
    background_image_height = background_image.dimensions[1]

    tweet_image_height = tweet_image.dimensions[1]

    # First resize the tweet so we can put it on the background
    max_tweet_image_height = background_image_height - 170
    if tweet_image_height > max_tweet_image_height
      tweet_image.resize "x#{background_image_height - 170}"
    end

    tweet_image_width = tweet_image.dimensions[0]

    result_image = background_image.composite(tweet_image) do |c|
      c.compose "Over"
      c.geometry "+#{(background_image_width / 2) - (tweet_image_width / 2)}+130"
    end

    badge_image_width = badge_image.dimensions[0]
    badge_image_height = badge_image.dimensions[1]

    tweet_image_top_right_corner_pos_x = (background_image_width / 2) + (tweet_image_width / 2)
    tweet_image_top_right_corner_pos_y = 130

    badge_image_composite_x = tweet_image_top_right_corner_pos_x - (badge_image_width / 2)
    badge_image_composite_y = tweet_image_top_right_corner_pos_y - (badge_image_height / 2)

    result_image = result_image.composite(badge_image) do |c|
      c.compose "Over"
      c.geometry "+#{badge_image_composite_x}+#{badge_image_composite_y}"
    end

    render json: {
      data_url: "data:image/png;base64," + Base64.encode64(result_image.to_blob).delete("\n"),
      name: screenshot[:name],
      mime: screenshot[:mime]
    }
  end
end
