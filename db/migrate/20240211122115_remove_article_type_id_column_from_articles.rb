class RemoveArticleTypeIdColumnFromArticles < ActiveRecord::Migration[7.0]
  def change
    remove_column :articles, :article_type_id
  end
end
