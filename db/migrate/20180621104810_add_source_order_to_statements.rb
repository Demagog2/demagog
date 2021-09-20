# frozen_string_literal: true

class AddSourceOrderToStatements < ActiveRecord::Migration[5.2]
  def change
    add_column :statements, :source_order, :int
  end
end
