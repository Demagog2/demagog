# frozen_string_literal: true

class RssController < ApplicationController
  def index
    @articles = Article
      .published
      .order(published_at: :desc)
      .limit(10)

    respond_to do |format|
      format.atom
    end
  end
end
