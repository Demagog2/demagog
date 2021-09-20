# frozen_string_literal: true

class AddExpertToSource < ActiveRecord::Migration[5.2]
  def change
    add_column :sources, :expert_id, :bigint
  end
end
