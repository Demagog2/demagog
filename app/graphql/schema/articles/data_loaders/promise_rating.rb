# frozen_string_literal: true

class Schema::Articles::DataLoaders::PromiseRating < GraphQL::Dataloader::Source
  def initialize(assessment_status)
    @assessment_status = assessment_status
  end

  def fetch(statement_ids)
    promise_ratings = PromiseRating.all.index_by(&:id)

    assessment_index = Assessment
      .joins(:promise_rating)
      .where(evaluation_status: @assessment_status, statement_id: statement_ids)
      .pluck(:statement_id, :promise_rating_id).to_h

    statement_ids.map do |statement_id|
      promise_ratings[assessment_index[statement_id]]
    end
  end
end
