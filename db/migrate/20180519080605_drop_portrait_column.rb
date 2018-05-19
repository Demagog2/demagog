class DropPortraitColumn < ActiveRecord::Migration[5.2]
  def up
    remove_column :speakers, :attachment_id, :bigint
  end

  def down
    add_reference :speakers, :attachment, index: true
  end
end
