class AddStatementIdToNotifications < ActiveRecord::Migration[5.2]
  def up
    add_column :notifications, :statement_id, :bigint

    select_all("SELECT * FROM notifications").each do |notification|
      match = notification["action_link"].match(/\/admin\/statements\/(\d+)/)
      statement_id = match[1].to_i
      
      execute "UPDATE notifications SET statement_id = #{statement_id} WHERE id = #{notification['id']}"
    end
    
    change_column :notifications, :statement_id, :bigint, null: false
    remove_column :notifications, :action_link
    remove_column :notifications, :action_text
  end

  def down
    add_column :notifications, :action_link, :string
    add_column :notifications, :action_text, :string

    select_all("SELECT * FROM notifications").each do |notification|
      action_link = "/admin/statements/#{notification['statement_id']}"
      execute "UPDATE notifications SET action_link = '#{action_link}', action_text = 'Na detail výroku' WHERE id = #{notification['id']}"
    end

    change_column :notifications, :action_link, :string, null: false
    change_column :notifications, :action_text, :string, null: false
    remove_column :notifications, :statement_id
  end
end
