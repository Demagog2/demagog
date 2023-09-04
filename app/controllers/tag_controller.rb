# frozen_string_literal: true

class TagController < FrontendController
  def show
    @page_number = params[:page]

    @tag = ArticleTag.friendly.find(params[:slug])

    @article_tags = ArticleTag.published

    @articles = Article.kept.published.for_articles_tag(@tag.id).order(published_at: :desc).page(@page_number).per(10) || []
    @top_articles = @articles[0..3] || []
    @bottom_articles = @articles[4..9] || []
  end
end
