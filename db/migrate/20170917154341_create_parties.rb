# frozen_string_literal: true

class CreateParties < ActiveRecord::Migration[5.1]
  def change
    create_table :parties do |t|
      t.string :name
      t.string :short_name
      t.string :description

      t.timestamps
    end
  end
end
