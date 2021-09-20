# frozen_string_literal: true

class CreateSources < ActiveRecord::Migration[5.1]
  def change
    create_table :sources do |t|
      t.text :transcript
      t.string :source_url
      t.datetime :released_at

      t.belongs_to :medium, index: true

      t.timestamps
    end

    change_table :statements do |t|
      t.belongs_to :source, index: true
    end
  end
end
