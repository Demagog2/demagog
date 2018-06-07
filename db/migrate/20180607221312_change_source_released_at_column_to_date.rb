class ChangeSourceReleasedAtColumnToDate < ActiveRecord::Migration[5.2]
  def up
    change_column :sources, :released_at, :date
  end

  def down
    change_column :sources, :released_at, :datetime
  end
end
