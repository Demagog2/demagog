class RenamePartiesToBodies < ActiveRecord::Migration[5.1]
  def change
    rename_table :parties, :bodies
    add_column :bodies, :is_party, :boolean

    rename_column :memberships, :party_id, :body_id
  end
end
