# frozen_string_literal: true

class Schema::Articles::DataLoaders::Statement < GraphQL::Dataloader::Source
  def fetch(article_ids)
    segments_index_by_article = ArticleSegment
      .joins('INNER JOIN "statements" ON "statements"."deleted_at" IS NULL AND "statements"."id" = cast("article_segments"."statement_id" as int)')
      .where(article_id: article_ids, segment_type: ArticleSegment::TYPE_SINGLE_STATEMENT)
      .pluck(:article_id, :statement_id)

    article_ids.map do |article_id|
      segments_index_by_article[article_id]
    end
  end
end
