# frozen_string_literal: true

namespace :screenshot do
  task :tweet, [:tweet_uri] => [:environment] do |task, args|
    raise Exception.new("Please provide tweet_uri argument, e.g. rake screenshot:tweet[https://twitter.com/strakovka/status/1298980569032712192]") if args.tweet_uri.nil?

    tweet_uri = args.tweet_uri

    puts "Creating screenshot from tweet at #{tweet_uri}..."
    tweet_image_path = Screenshots.screenshot_tweet(tweet_uri)
    puts "Done, screenshot path: #{tweet_image_path}"
  end
end
