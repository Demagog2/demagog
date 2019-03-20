# frozen_string_literal: true

require "test_helper"

class GraphQLTestCase < ActiveSupport::TestCase
  protected
    def execute(query_string, **kwargs)
      result = execute_with_errors(query_string, **kwargs)

      raise RuntimeError.new(result.errors) if result.errors

      result
    end

    def execute_with_errors(query_string, **kwargs)
      response = DemagogSchema.execute(query_string, kwargs)
      # Convert nested hash to an object
      JSON.parse(response.to_json, object_class: OpenStruct)
    end

    def authenticated_user_context(options = {})
      @user ||= options.fetch(:user) { create(:user, :admin) }

      { current_user: @user }
    end

    def assert_auth_needed_error(result)
      assert_graphql_error "You must be logged in to be able to access this", result
    end

    def assert_graphql_error(message, result)
      assert_not_nil result.errors
      assert_equal message, result.errors.first.message
    end
end
