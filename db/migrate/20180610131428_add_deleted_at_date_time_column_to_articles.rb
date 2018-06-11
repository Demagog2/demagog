class AddDeletedAtDateTimeColumnToArticles < ActiveRecord::Migration[5.2]
  def change
    add_column :articles, :deleted_at, :datetime
  end
end
