# frozen_string_literal: true

class CreateMemberships < ActiveRecord::Migration[5.1]
  def change
    create_table :memberships do |t|
      t.belongs_to :party, index: true
      t.belongs_to :speaker, index: true

      t.datetime :since
      t.datetime :until

      t.timestamps
    end
  end
end
