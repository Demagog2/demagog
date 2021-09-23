# frozen_string_literal: true

class SourceSpeakers < ActiveRecord::Migration[6.1]
  def change
    conn = ActiveRecord::Base.connection

    create_table :source_speakers do |t|
      t.belongs_to :source, index: true
      t.belongs_to :speaker, index: true
      t.string :first_name
      t.string :last_name
      t.integer :body_id
      t.string :role

      t.timestamps
    end

    select_all("SELECT * FROM sources_speakers").each do |sources_speakers_record|
      source_id = sources_speakers_record["source_id"]
      speaker_id = sources_speakers_record["speaker_id"]

      # Speakers id=29, id=164 and id=182 do not exist anymore
      next if speaker_id == 29 || speaker_id == 164 || speaker_id == 182

      speaker = Speaker.find(speaker_id)
      first_name = speaker.first_name
      last_name = speaker.last_name
      body_id = speaker.body ? speaker.body.id : "NULL"

      execute "INSERT INTO source_speakers (source_id, speaker_id, first_name, last_name, body_id, role, created_at, updated_at) VALUES (#{source_id}, #{speaker_id}, #{conn.quote(first_name)}, #{conn.quote(last_name)}, #{body_id}, #{conn.quote('')}, NOW(), NOW())"
    end

    drop_table :sources_speakers

    add_column :statements, :source_speaker_id, :integer
    add_index :statements, :source_speaker_id

    select_all("SELECT id, source_id, speaker_id, deleted_at FROM statements").each do |statements_record|
      source = Source.unscoped.find(statements_record["source_id"])
      source_speaker = source.source_speakers.where(speaker_id: statements_record["speaker_id"]).first

      unless source_speaker
        # Ignore source id=256 as it not using speakers properly anyway
        if !statements_record["deleted_at"].nil? || source.id == 256
          next
        else
          raise Exception.new("Could not find source speaker for statement id #{statements_record['id']}")
        end
      end

      execute "UPDATE statements SET source_speaker_id = #{source_speaker.id} WHERE id = #{statements_record['id']}"
    end

    update_view :article_stats, version: 3, revert_to_version: 2
    update_view :speaker_stats, version: 5, revert_to_version: 4

    remove_index :statements, :speaker_id
    remove_column :statements, :speaker_id
  end
end
