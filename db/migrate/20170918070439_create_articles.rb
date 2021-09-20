# frozen_string_literal: true

class CreateArticles < ActiveRecord::Migration[5.1]
  def change
    create_table :articles do |t|
      t.string :title
      t.string :slug
      t.text :perex
      t.datetime :published_at
      t.boolean :published

      # author
      t.belongs_to :user, index: true
      t.belongs_to :article_type, index: true
      t.belongs_to :source, index: true

      # attachment
      t.integer :illustration_id, index: true
      t.integer :document_id, index: true

      t.timestamps
    end

    create_table :articles_tags, id: false do |t|
      t.belongs_to :tag, index: true
      t.belongs_to :article, index: true
    end
  end
end
