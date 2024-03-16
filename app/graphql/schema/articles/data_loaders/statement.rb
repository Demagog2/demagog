# frozen_string_literal: true

class Schema::Articles::DataLoaders::Statement < GraphQL::Dataloader::Source
  def fetch(article_ids)
    segments_index_by_article = ArticleSegment
      .where(article_id: article_ids, segment_type: ArticleSegment::TYPE_SINGLE_STATEMENT)
      .pluck(:article_id, :statement_id)
      .to_h

    statements = Statement
                   .where(id: segments_index_by_article.values)
                   .index_by(&:id)

    article_ids.map do |article_id|
      statement_id = segments_index_by_article[article_id]
      statements[statement_id.to_i]
    end
  end
end
