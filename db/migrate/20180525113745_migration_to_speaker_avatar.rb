# frozen_string_literal: true

class MigrationToSpeakerAvatar < ActiveRecord::Migration[5.2]
  def up
    Speaker.all.each do |speaker|
      next if speaker.portrait.nil? || speaker.portrait.file.empty? || speaker.avatar.attached?

      begin
        url = Class.new.extend(ApplicationHelper).speaker_portrait(speaker.portrait)

        puts "Attaching #{speaker.full_name}, #{url}"

        open(ensure_absolute_url(url)) do |file|
          speaker.avatar.attach io: file, filename: speaker.portrait.file
          speaker.save
        end
      rescue
        puts "Failed migration of #{speaker.full_name}, #{url}"
      end
    end
  end

  def down
    Speaker.all.each do |speaker|
      speaker.avatar.purge
      speaker.save
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
