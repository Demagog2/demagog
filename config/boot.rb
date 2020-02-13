ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

require 'bundler/setup' # Set up gems listed in the Gemfile.

# Ignore ruby-2.7.0 deprecation messages
Warning[:deprecated] = false
