# frozen_string_literal: true

class CreateGovernments < ActiveRecord::Migration[6.0]
  def change
    create_table :governments do |t|
      t.string :name
      t.date :from
      t.date :to

      t.timestamps
    end
  end
end
