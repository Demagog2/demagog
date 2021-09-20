# frozen_string_literal: true

class CreatePages < ActiveRecord::Migration[5.2]
  def change
    create_table :pages do |t|
      t.string :title
      t.string :slug
      t.boolean :published
      t.text :text_html
      t.text :text_slatejson
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
