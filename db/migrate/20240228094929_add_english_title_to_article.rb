# frozen_string_literal: true

class AddEnglishTitleToArticle < ActiveRecord::Migration[7.0]
  def change
    add_column :articles, :title_en, :string, null: true
  end
end
