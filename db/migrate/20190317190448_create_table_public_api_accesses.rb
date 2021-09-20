# frozen_string_literal: true

class CreateTablePublicApiAccesses < ActiveRecord::Migration[5.2]
  def up
    create_table :public_api_accesses do |t|
      t.string :ip
      t.string :user_agent
      t.string :query
      t.json :variables
      t.timestamps
    end
  end

  def down
    drop_table :public_api_accesses
  end
end
