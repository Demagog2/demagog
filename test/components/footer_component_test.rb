# frozen_string_literal: true

require "test_helper"

class FooterComponentTest < ViewComponent::TestCase
  test "renders with empty cookies" do
    render_inline(FooterComponent.new(cookies: {}))

    assert_text "Zůstaňte v kontaktu"
  end

  test "renders consent info with cookies accepted" do
    render_inline(FooterComponent.new(cookies: { demagogcz_analytics_cookies: "accept" }))

    assert_text "Souhlas s použitím cookies pro měření návštěvnosti udělen."
  end

  test "renders consent info with cookies rejected" do
    render_inline(FooterComponent.new(cookies: { demagogcz_analytics_cookies: "reject" }))

    assert_text "Souhlas s použitím cookies pro měření návštěvnosti neudělen."
  end
end
