# frozen_string_literal: true

class CreateTags < ActiveRecord::Migration[5.1]
  def change
    create_table :tags do |t|
      t.string :name
      t.text :description
      t.boolean :is_policy_area

      t.timestamps
    end
  end
end
