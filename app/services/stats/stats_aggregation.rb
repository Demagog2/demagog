# frozen_string_literal: true

module Stats
  class StatsAggregation
    # @param [Array<Statement>] statements
    def aggregate(statements)
      correct_assessments = Assessment
                              .includes(:veracity)
                              .where(statement: statements)
                              .where(evaluation_status: Assessment::STATUS_CORRECT)

      correct_assessments.reduce(empty_stats) do |acc, assessment|
        acc[assessment.veracity.key.to_sym] += 1
        acc
      end
    end

    private

      def empty_stats
        Veracity.all.reduce({}) do |acc, veracity|
          acc[veracity.key.to_sym] = 0
          acc
        end
      end
  end
end
