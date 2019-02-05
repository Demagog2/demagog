class MigrateArticleHasSegments < ActiveRecord::Migration[5.2]
  def change
    execute "update segments join article_has_segments on segments.id = article_has_segments.segment_id set segments.article_id = article_has_segments.article_id;"
  end
end
