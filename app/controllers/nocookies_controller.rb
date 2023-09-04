# frozen_string_literal: true

class NocookiesController < FrontendController
  layout "nocookies"

  def index
    @page_number = params[:page]

    @articles =
      Article.kept.published.for_homepage.order(published_at: :desc).page(@page_number).per(10)
    @top_articles = @articles[0..3] || []
    @bottom_articles = @articles[4..9] || []

    @article_tags = ArticleTag.published

    @most_searched_speakers = Speaker.get_most_searched_speaker_ids.map do |speaker_id|
      Speaker.find_by(id: speaker_id)
    end

    # In case the speakers are not found, like in tests
    @most_searched_speakers = @most_searched_speakers.filter { |speaker| speaker }
  end
end
