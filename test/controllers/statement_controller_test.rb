# frozen_string_literal: true

require "test_helper"

class StatementControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    statement = create(:statement)
    get statement_url(statement)
    assert_response :success
  end
end
