class NotificationText < ActiveRecord::Migration[5.2]
  def up
    rename_column :notifications, :content, :full_text
    add_column :notifications, :statement_text, :text

    select_all("SELECT * FROM notifications").each do |notification|
      execute "UPDATE notifications SET statement_text = #{ActiveRecord::Base.connection.quote(notification['full_text'])} WHERE id = #{notification['id']}"
    end

    change_column :notifications, :statement_text, :text, null: false
  end

  def down
    remove_column :notifications, :statement_text
    rename_column :notifications, :full_text, :content
  end
end
