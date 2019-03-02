class ActivateExtensionUnaccent < ActiveRecord::Migration[5.2]
  def change
    execute "CREATE EXTENSION IF NOT EXISTS unaccent"
  end
end
