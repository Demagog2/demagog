class AddDeletedAtColumnToMediaAndMediaPersonalities < ActiveRecord::Migration[5.2]
  def change
    add_column :media, :deleted_at, :datetime
    add_column :media_personalities, :deleted_at, :datetime
  end
end
