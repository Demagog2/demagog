class DeleteStatementsCountInStatistics < ActiveRecord::Migration[6.0]
  def change
    remove_column :statements, :count_in_statistics, :boolean
  end
end
