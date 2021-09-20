# frozen_string_literal: true

class RenameExpertToEditor < ActiveRecord::Migration[6.0]
  def change
    execute "UPDATE roles SET name = 'Editor' WHERE key = 'expert'"
  end
end
