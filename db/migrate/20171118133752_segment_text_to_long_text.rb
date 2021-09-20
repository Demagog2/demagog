# frozen_string_literal: true

class SegmentTextToLongText < ActiveRecord::Migration[5.1]
  def up
    # PostgreSQL does not have longtext, in pg text is unlimited
    # change_colongtextlumn :segments, :text, :longtext
  end

  def down
    # PostgreSQL does not have longtext, in pg text is unlimited
    # change_column :segments, :text, :text
  end
end
