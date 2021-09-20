# frozen_string_literal: true

class AddIsInactiveBodyColumn < ActiveRecord::Migration[5.1]
  def change
    add_column :bodies, :is_inactive, :boolean, default: false
  end
end
