# frozen_string_literal: true

require File.expand_path("../../config/environment", __FILE__)
require "rails/test_help"

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Enable factorybot
  include FactoryBot::Syntax::Methods

  private
    def assert_discardable(subject)
      assert subject.is_a?(ActiveRecord::Base), "Subject expected to be instance of a model class"
      assert subject.respond_to?(:discard), "Missing `include Discardable` in the model class?"

      subject.discard

      assert_not_nil subject.deleted_at
      assert subject.discarded?
    end
end
