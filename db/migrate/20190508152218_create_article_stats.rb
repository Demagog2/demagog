class CreateArticleStats < ActiveRecord::Migration[5.2]
  def change
    create_view :article_stats
  end
end
