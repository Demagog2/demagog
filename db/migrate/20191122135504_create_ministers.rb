# frozen_string_literal: true

class CreateMinisters < ActiveRecord::Migration[6.0]
  def change
    create_table :ministers do |t|
      t.integer :government_id
      t.integer :speaker_id
      t.integer :ordering
      t.string :name

      t.timestamps
    end
  end
end
