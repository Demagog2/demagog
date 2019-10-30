class AddVideoRelatedFieldsToSource < ActiveRecord::Migration[6.0]
  def change
    add_column :sources, :video_type, :integer
    add_column :sources, :video_id, :string
  end
end
