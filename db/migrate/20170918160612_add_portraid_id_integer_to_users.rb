# frozen_string_literal: true

class AddPortraidIdIntegerToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :portrait_id, :integer
  end
end
