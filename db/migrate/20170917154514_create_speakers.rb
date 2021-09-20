# frozen_string_literal: true

class CreateSpeakers < ActiveRecord::Migration[5.1]
  def change
    create_table :speakers do |t|
      t.string :before_name
      t.string :first_name
      t.string :last_name
      t.string :after_name
      t.text :bio
      t.string :website_url
      t.boolean :status

      t.timestamps
    end
  end
end
