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
  end
end
