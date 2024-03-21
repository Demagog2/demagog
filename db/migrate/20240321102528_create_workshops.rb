# frozen_string_literal: true

class CreateWorkshops < ActiveRecord::Migration[7.0]
  def change
    create_table :workshops do |t|
      t.string :name
      t.string :description
      t.integer :price

      t.timestamps
    end
  end
end
