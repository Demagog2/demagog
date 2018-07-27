# frozen_string_literal: true

class HomepageController < ApplicationController
  def index
    unless params[:page].present?
      @cover_story = Article.cover_story
      @interesting_statements = Statement.interesting_statements
    else 
      @page_number = params[:page]
    end

    @articles = Article
      .published
      .order(published_at: :desc)
      .page(params[:page])

    return unless Rails.env.production?

    expires_in 1.hour, public: true
  end
end
