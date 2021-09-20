# frozen_string_literal: true

class AddArticleSegmentTypePromise < ActiveRecord::Migration[5.2]
  def change
    add_column :article_segments, :promise_url, :string
  end
end
