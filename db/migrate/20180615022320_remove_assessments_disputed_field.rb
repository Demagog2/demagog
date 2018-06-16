class RemoveAssessmentsDisputedField < ActiveRecord::Migration[5.2]
  def change
    remove_column :assessments, :disputed, :boolean
  end
end
