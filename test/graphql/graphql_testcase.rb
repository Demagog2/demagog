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

    def authenticated_user_context
      @user = @user || create(:user)

      { current_user: @user }
    end

    def assert_auth_needed_error(result)
      assert_same "You must be logged in to be able to access this", result["errors"][0]["message"]
    end
end
