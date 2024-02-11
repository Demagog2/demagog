# frozen_string_literal: true

class RemoveArticleTypeTable < ActiveRecord::Migration[7.0]
  def change
    drop_table :article_types
  end
end
