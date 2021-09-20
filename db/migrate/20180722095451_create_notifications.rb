# frozen_string_literal: true

class CreateNotifications < ActiveRecord::Migration[5.2]
  def change
    create_table :notifications do |t|
      t.text :content, null: false
      t.string :action_link, null: false
      t.string :action_text, null: false
      t.belongs_to :recipient, index: true, null: false
      t.datetime :created_at, null: false
      t.datetime :read_at
    end
  end
end
