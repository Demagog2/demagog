# frozen_string_literal: true

class CreateContentImages < ActiveRecord::Migration[5.2]
  def change
    create_table :content_images do |t|
      t.belongs_to :user, index: true
      t.datetime :created_at, null: false
      t.datetime :deleted_at
    end
  end
end
