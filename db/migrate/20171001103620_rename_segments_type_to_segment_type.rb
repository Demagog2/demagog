# frozen_string_literal: true

class RenameSegmentsTypeToSegmentType < ActiveRecord::Migration[5.1]
  def change
    rename_column :segments, :type, :segment_type
  end
end
