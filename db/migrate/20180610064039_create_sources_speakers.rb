# frozen_string_literal: true

class CreateSourcesSpeakers < ActiveRecord::Migration[5.2]
  def change
    create_table :sources_speakers, id: false do |t|
      t.belongs_to :source, index: true
      t.belongs_to :speaker, index: true
    end
  end
end
