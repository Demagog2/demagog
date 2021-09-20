# frozen_string_literal: true

class CreateArticleHasSegments < ActiveRecord::Migration[5.1]
  def change
    create_table :article_has_segments do |t|
      t.integer :order

      t.belongs_to :article, index: true
      t.belongs_to :segment, index: true

      t.timestamps
    end
  end
end
