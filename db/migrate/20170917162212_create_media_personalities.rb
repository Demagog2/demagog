# frozen_string_literal: true

class CreateMediaPersonalities < ActiveRecord::Migration[5.1]
  def change
    create_table :media_personalities do |t|
      t.string :kind
      t.string :name
      t.text :description

      t.belongs_to :attachment, index: true

      t.timestamps
    end

    create_table :media_personalities_media, id: false do |t|
      t.belongs_to :medium, index: true
      t.belongs_to :media_personality, index: true
    end

    change_table :sources do |t|
      t.belongs_to :media_personality, index: true
    end
  end
end
