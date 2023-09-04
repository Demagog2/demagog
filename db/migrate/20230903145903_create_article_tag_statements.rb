# frozen_string_literal: true

class CreateArticleTagStatements < ActiveRecord::Migration[7.0]
  def change
    create_table :article_tag_statements do |t|
      t.references :article_tag, null: false, foreign_key: true
      t.references :statement, null: false, foreign_key: true

      t.timestamps
    end
  end
end
