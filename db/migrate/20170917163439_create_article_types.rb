# frozen_string_literal: true

class CreateArticleTypes < ActiveRecord::Migration[5.1]
  def change
    create_table :article_types do |t|
      t.string :type
      t.text :template

      t.timestamps
    end
  end
end
