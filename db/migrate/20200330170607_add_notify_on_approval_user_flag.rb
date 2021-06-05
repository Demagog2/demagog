class AddNotifyOnApprovalUserFlag < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :notify_on_approval, :boolean, default: false
  end
end
