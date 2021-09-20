# frozen_string_literal: true

class ChangeRolesToHaveKeyAndName < ActiveRecord::Migration[5.2]
  def change
    rename_column :roles, :name, :key
    add_column :roles, :name, :string

    create_or_update_role("admin", key: "admin", name:  "Administrátor")
    create_or_update_role("expert", key: "expert", name:  "Expert")
    create_or_update_role("stazista", key: "intern", name:  "Stážista")
    create_or_update_role("", key: "social_media_manager", name:  "Síťař")
    create_or_update_role("", key: "proofreader", name:  "Korektor")
  end

  def create_or_update_role(old_key, role)
    existing = Role.find_by(key: old_key)
    if existing.nil?
      Role.create!(role)
    else
      existing.update!(role)
    end
  end
end
