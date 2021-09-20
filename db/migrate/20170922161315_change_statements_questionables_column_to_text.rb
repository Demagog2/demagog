# frozen_string_literal: true

class ChangeStatementsQuestionablesColumnToText < ActiveRecord::Migration[5.1]
  def change
    change_column :statements, :questionables, :text
  end
end
