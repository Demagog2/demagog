# frozen_string_literal: true

class AddAssessmentMethodologyToArticle < ActiveRecord::Migration[7.0]
  def change
    add_belongs_to :articles, :assessment_methodology, foreign_key: true, optional: true
  end
end
