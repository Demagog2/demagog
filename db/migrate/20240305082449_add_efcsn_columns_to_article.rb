# frozen_string_literal: true

class AddEfcsnColumnsToArticle < ActiveRecord::Migration[7.0]
  def change
    add_column :articles, :efcsn_external_id, :string, nullable: true
    add_column :articles, :efcsn_created_at, :datetime, nullable: true
    add_column :articles, :efcsn_updated_at, :datetime, nullable: true
  end
end
