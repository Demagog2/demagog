# frozen_string_literal: true

require "test_helper"

class GraphQLTestCase < ActiveSupport::TestCase
  protected
    def execute(query_string, **kwargs)
      result = DemagogSchema.execute(query_string, kwargs)

      if result["errors"]
        raise RuntimeError.new(result["errors"])
      end

      result
    end

    def execute_with_errors(query_string, **kwargs)
      DemagogSchema.execute(query_string, kwargs)
    end

    def authenticated_user_context(options = {})
      @user ||= options.fetch(:user) { create(:user, :admin) }

      { current_user: @user }
    end

    def assert_auth_needed_error(result)
      assert_graphql_error "You must be logged in to be able to access this", result
    end

    def assert_graphql_error(message, result)
      assert_equal message, result["errors"][0]["message"]
    end
end
