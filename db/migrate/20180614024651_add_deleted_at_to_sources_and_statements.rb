# frozen_string_literal: true

class AddDeletedAtToSourcesAndStatements < ActiveRecord::Migration[5.2]
  def change
    add_column :sources, :deleted_at, :datetime
    add_column :statements, :deleted_at, :datetime
  end
end
