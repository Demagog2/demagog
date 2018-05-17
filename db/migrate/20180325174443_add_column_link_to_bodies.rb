class AddColumnLinkToBodies < ActiveRecord::Migration[5.1]
  def change
    add_column :bodies, :link, :string
  end
end
