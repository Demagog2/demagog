# frozen_string_literal: true

require_relative "./helpers/duplication_tester"

class MissingPortrait
  def id
    nil
  end
end

class SpeakerMigration
  attr_accessor :connection

  def initialize(connection)
    self.connection = connection

    @duplication_tester = DuplicationTester.new
  end

  def get_status(id)
    # self::VERSION_SK => [72, 74, 90, 93, 109, 113, 116, 136, 149],
    deleted_ids = [
      204, 200, 216, 219, 232
    ]

    deleted_ids.include?(id.to_i)
  end

  def perform
    old_speakers = connection.query("SELECT * FROM politik")

    keys = [
      :id,
      :attachment_id,
      :first_name,
      :last_name,
      :before_name,
      :after_name,
      :bio,
      :website_url,
      :status,
      :created_at,
      :updated_at
    ]

    Speaker.bulk_insert(*keys) do |worker|
      old_speakers.each do |old_speaker|
        next if @duplication_tester.duplicate?(old_speaker["id"])

        portrait = MissingPortrait.new

        if old_speaker["fotografia"]
          portrait = Attachment.create(
            attachment_type: Attachment::TYPE_PORTRAIT,
            file: old_speaker["fotografia"]
          )
        end

        worker.add([
                     old_speaker["id"],
                     portrait.id,
                     old_speaker["meno"],
                     old_speaker["priezvisko"],
                     old_speaker["titul_pred_menom"],
                     old_speaker["titul_za_menom"],
                     old_speaker["zivotopis"],
                     old_speaker["web"],
                     get_status(old_speaker["id"]),
                     Time.now,
                     Time.now
                   ])

      end
    end
  end
end
