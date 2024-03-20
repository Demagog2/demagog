# frozen_string_literal: true

require "test_helper"

class ModalComponentTest < ViewComponent::TestCase
  def test_component_renders_something_useful
    render_inline(ModalComponent.new(id: "my-modal")) { "Hello, World" }

    assert_selector("#my-modal.modal", text: "Hello, World")
    assert_selector("#my-modal .modal-overlay")
    assert_selector("#my-modal .close-button")
  end
end
