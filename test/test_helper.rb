# frozen_string_literal: true

require File.expand_path("../../config/environment", __FILE__)
require "rails/test_help"
require "elasticsearch"
require "webmock/minitest"

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Enable factorybot
  include FactoryBot::Syntax::Methods

  private
    def allow_net_connect!
      WebMock.allow_net_connect!
    end

    def disable_net_connect!
      WebMock.disable_net_connect!
    end

    def elasticsearch_index(models)
      models.each do |model|
        model.__elasticsearch__.create_index!
        model.__elasticsearch__.import

        # Call refresh to make sure the indexed documents are searchable
        model.__elasticsearch__.refresh_index!
      end
    end

    def elasticsearch_cleanup(models)
      models.each do |model|
        model.__elasticsearch__.delete_index!
      end
    end

    def assert_discardable(subject)
      assert subject.is_a?(ActiveRecord::Base), "Subject expected to be instance of a model class"
      assert subject.respond_to?(:discard), "Missing `include Discardable` in the model class?"

      subject.discard

      assert_not_nil subject.deleted_at
      assert subject.discarded?
    end
end
