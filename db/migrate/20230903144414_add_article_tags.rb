# frozen_string_literal: true

class AddArticleTags < ActiveRecord::Migration[7.0]
  def change
    create_table :article_tags do |t|
      t.string :title
      t.string :slug
      t.text :description
      t.integer :icon, default: 0
      t.belongs_to :medium, index: true, null: true
      t.string :video
      t.integer :stats, default: 0
      t.boolean :published
      t.datetime :published_at
      t.integer :order, default: 0

      t.timestamps
    end

    create_table :article_tag_speakers do |t|
      t.belongs_to :article_tag, index: true, null: true
      t.belongs_to :speaker, index: true, null: true
      t.integer :order, default: 0

      t.timestamps
    end

    create_table :article_tag_articles do |t|
      t.belongs_to :article_tag, index: true, null: true
      t.belongs_to :article, index: true, null: true
      t.timestamps
    end
  end
end
