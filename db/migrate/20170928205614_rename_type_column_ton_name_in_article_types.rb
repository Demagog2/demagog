# frozen_string_literal: true

class RenameTypeColumnTonNameInArticleTypes < ActiveRecord::Migration[5.1]
  def change
    rename_column :article_types, :type, :name
  end
end
