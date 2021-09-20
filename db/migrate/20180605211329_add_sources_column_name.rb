# frozen_string_literal: true

class AddSourcesColumnName < ActiveRecord::Migration[5.2]
  def change
    add_column :sources, :name, :string
  end
end
