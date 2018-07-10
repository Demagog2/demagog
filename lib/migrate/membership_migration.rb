# frozen_string_literal: true

class MembershipMigration
  attr_accessor :connection
  attr_accessor :quiet

  def initialize(connection, quiet)
    self.connection = connection
    self.quiet = quiet
  end

  def beginning_of_the_year(year)
    DateTime.now.change(year: year.to_i, month: 1, day: 1)
  end

  def perform
    old_memberships = self.connection.query("SELECT * FROM politik_strana")

    Membership.bulk_insert(:speaker_id, :body_id, :since, :until, :created_at, :updated_at) do |worker|
      old_memberships.each do |old_membership|
        since_date = old_membership["rok_od"] != 0 ? beginning_of_the_year(old_membership["rok_od"]) : nil
        until_date = old_membership["rok_do"] != 0 ? beginning_of_the_year(old_membership["rok_do"]) : nil

        worker.add([
                     old_membership["id_politik"],
                     old_membership["id_politicka_strana"],
                     since_date,
                     until_date,
                     Time.now,
                     Time.now
                   ])
      end
    end
  end
end
