# frozen_string_literal: true

class HomepageController < FrontendController
  def index
    cover_story = Article.kept.published.for_homepage.order(published_at: :desc).first

    unless params[:page].present?
      @cover_story = cover_story
      @interesting_statements = Statement.interesting_statements
    else
      @page_number = params[:page]
    end

    @articles =
      Article.kept.published.for_homepage.order(published_at: :desc).where.not(id: cover_story).page(
        params[:page]
      )
        .per(10)

    # return unless Rails.env.production?

    # TODO: revisit cache headers and do properly
    # expires_in 1.hour, public: true
  end
end
