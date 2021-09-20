# frozen_string_literal: true

class CreateRoles < ActiveRecord::Migration[5.1]
  def change
    create_table :roles do |t|
      t.string :name

      t.timestamps
    end

    create_table :users_roles do |t|
      t.belongs_to :user, index: true
      t.belongs_to :role, index: true
    end
  end
end
