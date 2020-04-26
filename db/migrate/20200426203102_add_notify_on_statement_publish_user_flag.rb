class AddNotifyOnStatementPublishUserFlag < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :notify_on_statement_publish, :boolean, default: false
  end
end
