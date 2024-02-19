# frozen_string_literal: true

class AddGovPromisesEvaluationsFeatureFlag < ActiveRecord::Migration[7.0]
  def change
    Flipper.add("government_promises_evaluations")
  end
end
