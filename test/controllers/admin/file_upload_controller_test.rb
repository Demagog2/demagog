# frozen_string_literal: true

require "test_helper"

class Admin::FileUploadControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  def remove_uploaded_files
    FileUtils.rm_rf(Rails.root.join("tmp", "storage"))
  end

  def after_teardown
    super

    remove_uploaded_files
  end

  test "upload profile picture requires authorization" do
    fixture = fixture_file_upload("files/speaker.png", "image/png")

    speaker = speakers(:one)

    post "upload_profile_picture", params: { id: speaker.id, file: fixture }

    assert_response :found
  end

  test "post speaker portrait" do
    sign_in users(:one)

    fixture = fixture_file_upload("files/speaker.png", "image/png")

    speaker = speakers(:one)

    assert_changes -> { speaker.reload.avatar.attached? } do
      post "upload_profile_picture", params: { id: speaker.id, file: fixture }
    end

    assert_response :success
  end

  test "delete profile picture requires authorization" do
    speaker = speakers(:one)

    delete "delete_profile_picture", params: { id: speaker.id }

    assert_response :found
  end

  test "delete profile picture" do
    sign_in users(:one)

    speaker = speakers(:one)

    fixture = fixture_file_upload("files/speaker.png", "image/png")

    speaker.avatar.attach fixture

    assert_changes -> { speaker.reload.avatar.attached? } do
      delete "delete_profile_picture", params: { id: speaker.id }
    end

    assert_response :success
  end

  test "handling missing speaker id" do
    sign_in users(:one)

    speaker = speakers(:one)

    delete "delete_profile_picture", params: { id: "non-existent" }

    assert_response :not_found
  end
end
