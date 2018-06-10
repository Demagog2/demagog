# frozen_string_literal: true

class EmptyLogo
  def id
    nil
  end
end

class MediumMigration
  attr_accessor :connection

  def initialize(connection)
    self.connection = connection
  end

  def perform
    migrate_media
    migrate_media_personalities
    migrate_sources
  end

  def migrate_media
    old_media = self.connection.query("SELECT * FROM relacia")

    old_media.each do |old_medium|
      logo = EmptyLogo.new

      if old_medium["logo"]
        logo = Attachment.create!(
          attachment_type: Attachment::TYPE_LOGO,
          file: old_medium["logo"]
        )
      end

      Medium.create!(
        id: old_medium["id"],
        name: old_medium["nazov"],
        description: old_medium["popis"],
        attachment: logo
      )
    end

    def migrate_media_personalities
      old_media_personalities = self.connection.query("SELECT * FROM moderator")

      old_media_personalities.each do |old_media_personality|
        MediaPersonality.create!(
          id: old_media_personality["id"],
          name: old_media_personality["moderator"],
          media: [Medium.find(old_media_personality["id_relacia"])]
        )
      end
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
  end
end
