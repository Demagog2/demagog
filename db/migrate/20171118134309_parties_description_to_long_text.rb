class PartiesDescriptionToLongText < ActiveRecord::Migration[5.1]
  def up
    # PostgreSQL does not have longtext, in pg text is unlimited
    # change_column :parties, :description, :longtext
  end

  def down
    # PostgreSQL does not have longtext, in pg text is unlimited
    # change_column :parties, :description, :text
  end
end
