# frozen_string_literal: true

class CreateMenuItems < ActiveRecord::Migration[5.2]
  def change
    create_table :menu_items do |t|
      t.string :title
      t.string :kind, null: false
      t.belongs_to :page
      t.integer :order, null: false
      t.datetime :created_at, null: false
    end
  end
end
