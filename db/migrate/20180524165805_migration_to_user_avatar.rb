require "open-uri"

class MigrationToUserAvatar < ActiveRecord::Migration[5.2]
  def up
    User.unscoped.all.each do |user|
      next if user.portrait.nil? || user.portrait.file.empty? || user.avatar.attached?

      begin
        url = Class.new.extend(ApplicationHelper).user_portrait(user.portrait)

        puts "Attaching #{user.email}, #{url}"

        open(ensure_absolute_url(url)) do |file|
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

  private
    def legacy_hostname
      "http://legacy.demagog.cz"
    end

    def ensure_absolute_url(url)
      return url if url.start_with? legacy_hostname

      legacy_hostname + url
    end
end
