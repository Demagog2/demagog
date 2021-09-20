# frozen_string_literal: true

class AddKeyColumnToVeracities < ActiveRecord::Migration[5.1]
  def change
    add_column :veracities, :key, :string
  end
end
