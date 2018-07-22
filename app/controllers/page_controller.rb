# frozen_string_literal: true

class PageController < ApplicationController
  def show
    @page = Page.published.friendly.find(params[:slug])
  end
end
