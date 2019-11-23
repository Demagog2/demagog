class UpdateArticleStatsToVersion2 < ActiveRecord::Migration[6.0]
  def change
    update_view :article_stats, version: 2, revert_to_version: 1
  end
end
