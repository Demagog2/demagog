# frozen_string_literal: true

class AddSpeakerRole < ActiveRecord::Migration[6.1]
  def change
    add_column :speakers, :role, :string
  end
end
