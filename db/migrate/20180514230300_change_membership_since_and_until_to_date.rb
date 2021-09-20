# frozen_string_literal: true

class ChangeMembershipSinceAndUntilToDate < ActiveRecord::Migration[5.2]
  def up
    change_column :memberships, :since, :date
    change_column :memberships, :until, :date
  end

  def down
    change_column :memberships, :since, :datetime
    change_column :memberships, :until, :datetime
  end
end
