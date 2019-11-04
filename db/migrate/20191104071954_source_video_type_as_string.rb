class SourceVideoTypeAsString < ActiveRecord::Migration[6.0]
  def change
    change_column :sources, :video_type, :string

    execute "UPDATE sources SET video_type = 'facebook' WHERE video_type = '0'"
    execute "UPDATE sources SET video_type = 'youtube' WHERE video_type = '1'"
  end
end
