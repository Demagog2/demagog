# frozen_string_literal: true

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
      Medium.create!(
        id: old_medium["id"],
        name: old_medium["nazov"],
        description: old_medium["popis"],
      )
    end

    progressbar = ProgressBar.create(format: "Migrating media logos: %a %e |%b>>%i| %p%% %t", total: old_media.size)

    old_media.each do |old_medium|
      unless old_medium["logo"].empty?
        path = "/data/relacie/t/#{old_medium["logo"]}"
        medium = Medium.find(old_medium["id"])

        ImageUrlHelper.open_image(path) do |file|
          medium.logo.attach io: file, filename: old_medium["logo"]
        end
      end

      progressbar.increment
    end
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
