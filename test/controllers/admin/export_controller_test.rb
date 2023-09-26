
# frozen_string_literal: true

require "test_helper"

class Admin::ExportControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  test "export requires authorization" do
    get "speakers", format: :xlsx


    assert_response :unauthorized
  end

  test "it should return exported data" do
    sign_in create(:user)

    create(:statement)
    get "speakers", format: :xlsx

    assert_response :success
  end
end
