class SegmentsCleanup < ActiveRecord::Migration[5.2]
  def change
    # Because we are not using it anymore
    drop_table :article_has_segments

    # Helps navigating in the database, name "segment" is too general
    rename_table :segments, :article_segments
  end
end
