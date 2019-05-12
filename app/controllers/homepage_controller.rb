# frozen_string_literal: true

class HomepageController < ApplicationController
  def index
    unless params[:page].present?
      @cover_story = Article.cover_story
      @interesting_statements = Statement.interesting_statements

      # Preview only for users signed in to admin. Remove when launching.
      @show_promises = user_signed_in?
      @promises_stats = get_promises_stats
    else
      @page_number = params[:page]
      @show_promises = false
    end

    @articles = Article
      .published
      .order(published_at: :desc)
      .page(params[:page])

    # return unless Rails.env.production?

    # TODO: revisit cache headers and do properly
    # expires_in 1.hour, public: true
  end

  private
    def get_promises_stats
      keys = [PromiseRating::FULFILLED, PromiseRating::IN_PROGRESS, PromiseRating::BROKEN, PromiseRating::STALLED]

      statements = Statement
        .where(source_id: [562])
        .where(assessments: {
          evaluation_status: Assessment::STATUS_APPROVED,
        })
        .includes(:assessment, assessment: :promise_rating)

      keys.map { |key| [key, statements.where(assessments: { promise_ratings: { key: key } }).count] }.to_h
    end
end
