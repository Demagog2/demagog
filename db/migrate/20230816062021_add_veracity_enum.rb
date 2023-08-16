# frozen_string_literal: true

class AddVeracityEnum < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      CREATE TYPE veracity AS ENUM ('true', 'untrue', 'misleading', 'unverifiable');
    SQL

    add_column :assessments, :veracity_new, :veracity, default: nil, nullable: true
  end

  def down
    remove_column :assessments, :veracity_new

    execute <<-SQL
      CREATE TYPE veracity AS ENUM ('true', 'untrue', 'misleading', 'unverifiable');
    SQL
  end
end
