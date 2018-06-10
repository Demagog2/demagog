class SourceNameNotNull < ActiveRecord::Migration[5.2]
  def up
    change_column :sources, :name, :string, null: false
  end

  def down
    change_column :sources, :name, :string, null: true
  end
end
