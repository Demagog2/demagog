# frozen_string_literal: true

require File.expand_path("../../config/environment", __FILE__)
require "rails/test_help"

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Enable factorybot
  include FactoryBot::Syntax::Methods
end
