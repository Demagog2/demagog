# frozen_string_literal: true

class RemoveUserPortraitAttachment < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :portrait_id, :int
  end
end
