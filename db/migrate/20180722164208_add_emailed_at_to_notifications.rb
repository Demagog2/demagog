# frozen_string_literal: true

class AddEmailedAtToNotifications < ActiveRecord::Migration[5.2]
  def change
    add_column :notifications, :emailed_at, :datetime
  end
end
