# frozen_string_literal: true

class SourcesMediaPersonalities < ActiveRecord::Migration[5.2]
  def change
    # Having personalities linked to media does not help experts
    # in the administration
    drop_table :media_media_personalities

    # Source can now have 0-n personalities
    create_table :sources_media_personalities, id: false do |t|
      t.belongs_to :source, index: true
      t.belongs_to :media_personality, index: true
    end
    Source.unscoped.each do |source|
      if source.media_personality_id
        source.media_personalities << MediaPersonality.unscoped.find(source.media_personality_id)
      end
    end
    remove_column :sources, :media_personality_id, :bigint

    # Split group personalities
    MediaPersonality.unscoped.where("name LIKE ? OR name LIKE ?", "%,%", "% a %").each do |group_personality|
      if group_personality.sources.size > 0
        names = group_personality.name.split(/(?:,| a )/).map { |name| name.strip }

        # Ensure we have all the personalities of those names
        personalities = names.map do |name|
          MediaPersonality.find_or_create_by!(name: name)
        end

        # For all group personality sources, replace the group with separate personalities
        group_personality.sources.each do |source|
          source.media_personalities = personalities
        end
      end

      group_personality.delete
    end

    # Merge duplicate media personalities
    MediaPersonality.unscoped.distinct.pluck(:name).each do |distinct_name|
      the_one = MediaPersonality.unscoped.where(name: distinct_name).first
      others = MediaPersonality.unscoped.where(name: distinct_name).where.not(id: the_one.id)

      others.each do |personality|
        personality.sources.each do |source|
          source.media_personalities.delete(personality)
          source.media_personalities << the_one
        end

        personality.delete
      end
    end

    # Remove media personality "Jiné", which was used when there was
    # no media personality to be assigned
    media_personality_other = MediaPersonality.find_by(name: "Jiné")
    if media_personality_other
      media_personality_other.sources.clear
      media_personality_other.delete
    end
  end
end
