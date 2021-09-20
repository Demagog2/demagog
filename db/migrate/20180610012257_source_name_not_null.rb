# frozen_string_literal: true

class SourceNameNotNull < ActiveRecord::Migration[5.2]
  def up
    Source.unscoped.where(name: nil).update_all(name: "")

    change_column :sources, :name, :string, null: false
  end

  def down
    change_column :sources, :name, :string, null: true
  end
end
