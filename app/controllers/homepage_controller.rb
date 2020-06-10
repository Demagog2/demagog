# frozen_string_literal: true

class HomepageController < FrontendController
  def index
    cover_story = Article.kept.published.order(published_at: :desc).first

    unless params[:page].present?
      @cover_story = cover_story
      @interesting_statements = Statement.interesting_statements
      @show_promises = true
      @promises_stats = get_promises_stats
    else
      @page_number = params[:page]
      @show_promises = false
    end

    @articles =
      Article.kept.published.order(published_at: :desc).where.not(id: cover_story).page(
        params[:page]
      )
        .per(10)

    # return unless Rails.env.production?

    # TODO: revisit cache headers and do properly
    # expires_in 1.hour, public: true
  end

  protected
    def get_promises_stats
      keys = [
        PromiseRating::FULFILLED,
        PromiseRating::IN_PROGRESS,
        PromiseRating::BROKEN,
        PromiseRating::STALLED
      ]

      statements =
        Statement.where(source_id: [562]).where(published: true).where(
          assessments: { evaluation_status: Assessment::STATUS_APPROVED }
        )
          .includes(:assessment, assessment: :promise_rating)

      keys.map do |key|
        [key, statements.where(assessments: { promise_ratings: { key: key } }).count]
      end.to_h
    end
end
