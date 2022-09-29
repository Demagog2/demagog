# frozen_string_literal: true

require "test_helper"

module Utils
  class AuthTest < ActiveSupport::TestCase
    test "#is_authorized" do
      ctx =  { current_user: build(:user, :social_media_manager) }

      assert Auth.is_authorized(ctx, %w[speakers:view speakers:edit])
    end
  end
end
