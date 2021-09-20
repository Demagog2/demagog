# frozen_string_literal: true

class CreateSegments < ActiveRecord::Migration[5.1]
  def change
    create_table :segments do |t|
      t.string :type
      t.text :text

      t.timestamps
    end
  end
end
