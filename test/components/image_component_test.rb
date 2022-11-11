# frozen_string_literal: true

require "test_helper"

class ImageComponentTest < ViewComponent::TestCase
  def test_component_renders_lazy_loaded_image
    render_inline(ImageComponent.new(src: src, alt: alt, lazy: true))

    assert_selector("img[src=\"#{src}\"][alt=\"#{alt}\"][loading=lazy]", count: 1)
  end

  def test_component_renders_non_lazy_loaded_image
    render_inline(ImageComponent.new(src: src, alt: alt, lazy: false))

    assert_selector("img[src=\"#{src}\"][alt=\"#{alt}\"][loading=lazy]", count: 0)
    assert_selector("img[src=\"#{src}\"][alt=\"#{alt}\"]", count: 1)
  end

  private
    def src
      "http://example.com"
    end

    def alt
      "Alt text"
    end
end
