# frozen_string_literal: true

class AddFoundationTerminationColumnsToBodies < ActiveRecord::Migration[5.1]
  def change
    add_column :bodies, :founded_at, :date
    add_column :bodies, :terminated_at, :date
  end
end
