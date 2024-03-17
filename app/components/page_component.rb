# frozen_string_literal: true

class PageComponent < ViewComponent::Base
  def initialize(page:, hidden: false)
    @page = page
    @hidden = hidden
  end

  def page_class
    "page#{@page}"
  end

  def hidden?
    @hidden
  end
end
