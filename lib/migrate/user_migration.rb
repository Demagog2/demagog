# frozen_string_literal: true

class UserMigration
  attr_accessor :connection

  def initialize(connection)
    self.connection = connection
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

      user.roles << Role.find_by(name: old_user["usertype"])

      if old_user["fotografia"]
        user.portrait = Attachment.create(
          attachment_type: Attachment::TYPE_PORTRAIT,
          file: old_user["fotografia"]
        )
      end

      user.save!
    end
  end
end
