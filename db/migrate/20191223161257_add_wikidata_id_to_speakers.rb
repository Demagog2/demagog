class AddWikidataIdToSpeakers < ActiveRecord::Migration[6.0]
  def change
    add_column :speakers, :wikidata_id, :string
  end
end
