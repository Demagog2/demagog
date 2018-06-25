class ChangeRolesToHaveKeyAndName < ActiveRecord::Migration[5.2]
  def change
    rename_column :roles, :name, :key
    add_column :roles, :name, :string

    Role.find_by(key: "admin").update!(name: "Administrátor")
    Role.find_by(key: "expert").update!(name: "Expert")
    Role.find_by(key: "stazista").update!(key: "intern", name: "Stážista")
    Role.create!(key: "social_media_manager", name: "Síťař")
    Role.create!(key: "proofreader", name: "Korektor")
  end
end
