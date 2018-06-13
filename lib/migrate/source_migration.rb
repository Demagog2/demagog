# frozen_string_literal: true

class SourceMigration
  attr_accessor :connection

  def initialize(connection)
    self.connection = connection
  end

  def perform
    migrate_sources
    migrate_sources_speakers
  end

  def migrate_sources
    old_sources = self.connection.query("SELECT * FROM diskusia")
    old_sources.each do |old_source|
      Source.create!(
        id: old_source["id"],
        name: old_source["nazov"],
        medium: Medium.find(old_source["id_relacia"]),
        media_personality: MediaPersonality.find(old_source["id_moderator"]),
        transcript: old_source["prepis_relacie"],
        released_at: old_source["datum"],
        source_url: old_source["url_videozaznam"]
      )
    end
  end

  def migrate_sources_speakers
    old_sources_speakers = self.connection.query("SELECT * FROM diskusia_politik")
    old_sources_speakers.each do |old_source_speaker|
      statement = ActiveRecord::Base.connection.raw_connection.prepare("INSERT INTO sources_speakers (source_id, speaker_id) VALUES (?, ?)")
      statement.execute(old_source_speaker["id_diskusia"], old_source_speaker["id_politik"])
    end
  end
end
