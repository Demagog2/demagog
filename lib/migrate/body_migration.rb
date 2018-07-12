# frozen_string_literal: true

require "ruby-progressbar/outputs/null"

# These logos do not exist on demagog anymore
NON_EXISTING_BODY_LOGOS = ["/data/politicke_strany/t/13651759724702.jpg"]

class BodyMigration
  attr_accessor :connection
  attr_accessor :quiet

  def initialize(connection, quiet)
    self.connection = connection
    self.quiet = quiet
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

      body.save!
    end

    progressbar = ProgressBar.create(
      format: "Migrating body logos: %e |%b>>%i| %p%% %t",
      total: old_parties.size,
      output: quiet ? ProgressBar::Outputs::Null : $stdout
    )

    old_parties.each do |old_party|
      unless old_party["logo"].empty?
        path = "/data/politicke_strany/t/#{old_party["logo"]}"

        unless NON_EXISTING_BODY_LOGOS.include?(path)
          body = Body.find(old_party["id"])

          ImageUrlHelper.open_image(path) do |file|
            body.logo.attach io: file, filename: old_party["logo"]
          end
        end
      end

      progressbar.increment
    end
  end
end
