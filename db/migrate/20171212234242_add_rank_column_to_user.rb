class AddRankColumnToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :rank, :int
  end
end
