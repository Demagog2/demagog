# frozen_string_literal: true

class CreateStatementTranscriptPosition < ActiveRecord::Migration[5.2]
  def change
    create_table :statement_transcript_positions do |t|
      t.belongs_to :statement, index: true
      t.belongs_to :source, index: true
      t.integer :start_line, null: false
      t.integer :start_offset, null: false
      t.integer :end_line, null: false
      t.integer :end_offset, null: false
    end
  end
end
