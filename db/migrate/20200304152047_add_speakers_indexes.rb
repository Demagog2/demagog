# frozen_string_literal: true

class AddSpeakersIndexes < ActiveRecord::Migration[6.0]
  def change
    add_index :speakers, :osoba_id
    add_index :speakers, :wikidata_id
  end
end
