class MigrateArticleHasSegments < ActiveRecord::Migration[5.2]
  def change
    execute "UPDATE segments SET article_id = article_has_segments.article_id FROM article_has_segments WHERE segments.id = article_has_segments.segment_id;"
  end
end
