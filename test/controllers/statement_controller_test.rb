# frozen_string_literal: true

require "test_helper"

class StatementControllerTest < ActionDispatch::IntegrationTest
  test "should display factual statement" do
    statement = create(:statement)
    get statement_url(statement)
    assert_response :success
  end

  test "should not display promise statement" do
    statement = create(:statement, :promise_statement)
    assert_raises(ActiveRecord::RecordNotFound) do
      get statement_url(statement)
    end
  end
end
