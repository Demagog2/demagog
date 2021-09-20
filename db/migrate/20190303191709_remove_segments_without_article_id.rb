# frozen_string_literal: true

class RemoveSegmentsWithoutArticleId < ActiveRecord::Migration[5.2]
  def change
    execute "DELETE FROM article_segments WHERE article_id IS NULL"
  end
end
