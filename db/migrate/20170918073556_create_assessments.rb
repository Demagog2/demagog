# frozen_string_literal: true

class CreateAssessments < ActiveRecord::Migration[5.1]
  def change
    create_table :assessments do |t|
      t.text :explanation
      t.string :evaluation_status
      t.datetime :evaluated_at
      t.boolean :disputed

      t.belongs_to :veracity, index: true
      t.belongs_to :user, index: true
      t.belongs_to :statement, index: true

      t.timestamps
    end
  end
end
