# frozen_string_literal: true

class AddPromiseRatingNotYetEvaluated < ActiveRecord::Migration[6.1]
  def up
    PromiseRating.find_or_create_by!(key: PromiseRating::NOT_YET_EVALUATED, name: "Zatím nehodnoceno")
  end

  def down
    # not implemented
  end
end
