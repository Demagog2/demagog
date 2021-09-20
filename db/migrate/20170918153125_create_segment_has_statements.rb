# frozen_string_literal: true

class CreateSegmentHasStatements < ActiveRecord::Migration[5.1]
  def change
    create_table :segment_has_statements do |t|
      t.belongs_to :segment, index: true
      t.belongs_to :statement, index: true

      t.integer :order

      t.timestamps
    end
  end
end
