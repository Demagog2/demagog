# frozen_string_literal: true

require "test_helper"

class ApplicationHelperTest < ActionView::TestCase
  test "',' sign in article illustration is escaped" do
    file = create(:attachment, file: "cover,photo.png")

    assert_equal article_illustration(file),
      "http://cdn.example.com/data/diskusia/s/cover%2Cphoto.png"
  end
end
