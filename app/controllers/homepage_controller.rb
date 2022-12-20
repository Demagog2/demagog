# frozen_string_literal: true

class HomepageController < FrontendController
  def index_old
    cover_story = Article.kept.published.for_homepage.order(published_at: :desc).first

    unless params[:page].present?
      @cover_story = cover_story
      @interesting_statements = Statement.interesting_statements
    else
      @page_number = params[:page]
    end

    @articles =
      Article.kept.published.for_homepage.order(published_at: :desc).where.not(id: cover_story)
        .page(params[:page])
        .per(10)

    # return unless Rails.env.production?

    # TODO: revisit cache headers and do properly
    # expires_in 1.hour, public: true
  end

  def index
    @page_number = params[:page]

    @articles =
      Article.kept.published.for_homepage.order(published_at: :desc).page(@page_number).per(10)
    @top_articles = @articles[0..3]
    @bottom_articles = @articles[4..9]

    @most_searched_speakers = Speaker.get_most_searched_speaker_ids.map do |speaker_id|
      Speaker.find_by(id: speaker_id)
    end
  end
end
