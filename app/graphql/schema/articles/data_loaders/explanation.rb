# frozen_string_literal: true

class Schema::Articles::DataLoaders::Explanation < GraphQL::Dataloader::Source
  def initialize(assessment_status)
    @assessment_status = assessment_status
  end

  def fetch(statement_ids)
    assessment_index = Assessment
       .select(:statement_id, :short_explanation, :explanation_html)
       .where(evaluation_status: @assessment_status, statement_id: statement_ids)
       .index_by(&:statement_id)

    statement_ids.map do |statement_id|
      assessment_index[statement_id]
    end
  end
end
