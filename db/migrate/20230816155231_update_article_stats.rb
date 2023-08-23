# frozen_string_literal: true

class UpdateArticleStats < ActiveRecord::Migration[7.0]
  def change
    update_view :article_stats, version: 4, revert_to_version: 3
  end
end
