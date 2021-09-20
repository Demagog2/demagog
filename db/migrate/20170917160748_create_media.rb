# frozen_string_literal: true

class CreateMedia < ActiveRecord::Migration[5.1]
  def change
    create_table :media do |t|
      t.string :kind
      t.string :name
      t.text :description

      t.belongs_to :attachment, index: true

      t.timestamps
    end
  end
end
