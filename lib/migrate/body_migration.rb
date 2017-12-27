# frozen_string_literal: true

class BodyMigration
  attr_accessor :connection

  def initialize(connection)
    self.connection = connection
  end

  # Define IDs that do not represent a political party.
  #
  def body_ids
    [8]
  end

  def is_party?(id)
    body_ids.exclude?(id.to_i)
  end

  def perform
    old_parties = self.connection.query("SELECT id, nazov, skratka, popis, logo FROM politicka_strana")

    old_parties.each do |old_party|
      body = Body.new(
        id: old_party["id"],
        name: old_party["nazov"],
        short_name: old_party["skratka"],
        description: old_party["popis"],
        is_party: is_party?(old_party["id"])
      )

      if old_party["logo"]
        body.attachment = Attachment.create(
          attachment_type: Attachment::TYPE_PARTY_LOGO,
          file: old_party["logo"]
        )
      end

      body.save!
    end
  end
end
