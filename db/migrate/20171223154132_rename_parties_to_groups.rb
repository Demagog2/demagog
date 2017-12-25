class RenamePartiesToGroups < ActiveRecord::Migration[5.1]
  def change
    rename_table :parties, :groups
    add_column :groups, :is_party, :boolean

    rename_column :memberships, :party_id, :group_id
  end
end
