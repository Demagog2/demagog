class AddNewExplanationColumnsToAssessment < ActiveRecord::Migration[5.2]
  def change
    rename_column :assessments, :explanation, :explanation_html
    add_column :assessments, :explanation_slatejson, :text
    add_column :assessments, :short_explanation, :text
  end
end
