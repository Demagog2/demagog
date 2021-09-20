# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.text :position_description
      t.text :bio
      t.string :email
      t.string :password
      t.string :phone
      t.datetime :registered_at
      t.integer :order
      t.boolean :active

      t.timestamps
    end
  end
end
