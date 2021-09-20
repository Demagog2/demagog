# frozen_string_literal: true

class RenameMediaMpTable < ActiveRecord::Migration[5.1]
  def change
    rename_table :media_personalities_media, :media_media_personalities
  end
end
