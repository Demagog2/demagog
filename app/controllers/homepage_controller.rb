# frozen_string_literal: true

class HomepageController < ApplicationController
  def index
    @cover_story = Article.cover_story
    @interesting_statements = Statement.interesting_statements
    @articles = Article
      .where(published: true, deleted_at: nil)
      .order(published_at: :desc)
      .page(params[:page])

    return unless Rails.env.production?

    expires_in 1.hour, public: true
  end
end
