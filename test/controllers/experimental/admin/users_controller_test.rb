require "test_helper"

class Experimental::Admin::UsersControllerTest < ActionDispatch::IntegrationTest
  setup { @user = create(:user) }

  test "should get index" do
    get experimental_admin_users_url
    assert_response :success
  end

  test "should get new" do
    get new_experimental_admin_user_url
    assert_response :success
  end

  test "should create admin_user" do
    assert_difference("User.count") do
      post experimental_admin_users_url, params: { admin_user: {} }
    end

    assert_redirected_to experimental_admin_user_url(User.last)
  end

  test "should show admin_user" do
    get experimental_admin_user_url(@user)
    assert_response :success
  end

  test "should get edit" do
    get edit_experimental_admin_user_url(@user)
    assert_response :success
  end

  test "should update admin_user" do
    patch experimental_admin_user_url(@user), params: { admin_user: {} }
    assert_redirected_to experimental_admin_user_url(@user)
  end

  test "should destroy admin_user" do
    assert_difference("User.count", -1) { delete experimental_admin_user_url(@user) }

    assert_redirected_to experimental_admin_users_url
  end
end