require "open-uri"

class MigrationToUserAvatar < ActiveRecord::Migration[5.2]
  def up
    User.all.each do |user|
      next if user.portrait.nil? || user.portrait.file.nil?

      begin
        url = Class.new.extend(ApplicationHelper).user_portrait(user.portrait)

        puts "Attaching #{user.email}, #{url}"

        open url do |file|
          user.avatar.attach io: file, filename: user.portrait.file
          user.save
        end
      rescue
        puts "Failed migration of #{user.email}, #{url}"
      end
    end
  end

  def down
    User.all.each do |user|
      user.avatar.purge
      user.save
    end
  end
end
