# frozen_string_literal: true

class CreateStatements < ActiveRecord::Migration[5.1]
  def change
    create_table :statements do |t|
      t.text :content
      t.boolean :questionables
      t.datetime :excerpted_at
      t.boolean :important
      t.boolean :published
      t.boolean :count_in_statistics

      t.belongs_to :speaker, index: true

      t.timestamps
    end
  end
end
