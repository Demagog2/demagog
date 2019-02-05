class AddArticleIdToSegments < ActiveRecord::Migration[5.2]
  def change
    add_reference :segments, :article, index: true
    add_foreign_key :segments, :articles

    add_column :segments, :order, :integer
  end
end
