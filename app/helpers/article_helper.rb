# frozen_string_literal: true

module ArticleHelper
  def show_article_factcheck_video(article)
    article.article_type.name == "default" && !article.source.nil? && !article.source.video_type.nil? && !article.source.video_id.nil?
  end
end
