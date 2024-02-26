# frozen_string_literal: true

class AddPromiseSourceUrlAndLabel < ActiveRecord::Migration[7.0]
  def change
    add_column :statements, :promise_source_url, :string, null: true
    add_column :statements, :promise_source_label, :string, null: true
  end
end
