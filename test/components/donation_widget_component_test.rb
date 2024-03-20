# frozen_string_literal: true

require "test_helper"

class DonationWidgetComponentTest < ViewComponent::TestCase
  def test_component_renders_something_useful
    render_inline(DonationWidgetComponent.new(class: "abc def", token: "my-token"))

    assert_selector("div.abc.def")
    assert_selector('[data-darujme-widget-token="my-token"]')
  end
end
