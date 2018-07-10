# frozen_string_literal: true

require "ruby-progressbar/outputs/null"

require_relative "./helpers/image_url_helper"

class UserMigration
  attr_accessor :connection
  attr_accessor :quiet

  def initialize(connection, quiet)
    self.connection = connection
    self.quiet = quiet
  end

  def perform
    old_users = self.connection.query("SELECT user.*, usertype.usertype, usertype.rank, usertype_name
      FROM user LEFT JOIN usertype ON user.id_usertype = usertype.id")

    old_users.each do |old_user|
      user = User.new(id: old_user["id"],
        first_name: old_user["meno"],
        last_name: old_user["priezvisko"],
        bio: old_user["bio"],
        email: old_user["email"],
        phone: old_user["telefon"],
        registered_at: old_user["ts_registered"],
        active: old_user["status"] == 1,
        position_description: old_user["usertype_name"],
        rank: old_user["rank"]
      )

      user.roles << Role.find_by(key: usertype_to_role_key(old_user["usertype"]))

      user.save!
    end

    progressbar = ProgressBar.create(
      format: "Migrating user avatars: %e |%b>>%i| %p%% %t",
      total: old_users.size,
      output: quiet ? ProgressBar::Outputs::Null : $stdout
    )

    old_users.each do |old_user|
      unless old_user["fotografia"].empty?
        path = "/data/users/s/#{old_user["fotografia"]}"
        user = User.find(old_user["id"])

        ImageUrlHelper.open_image(path) do |file|
          user.avatar.attach io: file, filename: old_user["fotografia"]
        end
      end

      progressbar.increment
    end
  end

  private
    def usertype_to_role_key(usertype)
      case usertype
      when "admin" then "admin"
      when "expert" then "expert"
      when "stazista" then "intern"
      else raise Exception.new("Unexpected usertype #{usertype}")
      end
    end
end
