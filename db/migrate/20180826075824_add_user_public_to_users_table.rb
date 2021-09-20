# frozen_string_literal: true

class AddUserPublicToUsersTable < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :user_public, :boolean, nullable: false, default: false
  end
end
