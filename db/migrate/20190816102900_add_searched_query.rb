# frozen_string_literal: true

class AddSearchedQuery < ActiveRecord::Migration[5.2]
  def change
    create_table :searched_queries do |t|
      t.string :query, null: false
      t.string :result_type
      t.json :result, null: false
      t.belongs_to :user, index: true
      t.timestamps
    end
  end
end
