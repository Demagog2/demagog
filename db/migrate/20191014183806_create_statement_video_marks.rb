# frozen_string_literal: true

class CreateStatementVideoMarks < ActiveRecord::Migration[6.0]
  def change
    create_table :statement_video_marks do |t|
      t.integer :start
      t.integer :stop
      t.integer :source_id
      t.integer :statement_id

      t.timestamps
    end
  end
end
