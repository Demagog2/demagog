# frozen_string_literal: true

class RemoveStatementsQuestionablesColumn < ActiveRecord::Migration[5.2]
  def change
    remove_column :statements, :questionables, :text
  end
end
