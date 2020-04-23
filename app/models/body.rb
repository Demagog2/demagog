# frozen_string_literal: true

class Body < ApplicationRecord
  include Searchable

  has_many :memberships, dependent: :destroy
  has_many :speakers, through: :memberships
  belongs_to :attachment, optional: true

  has_one_attached :logo

  def current_members
    speakers
      .where(memberships: { until: nil })
      .order(last_name: :asc)
  end

  def self.matching_name(name)
    where(
      "name ILIKE ? OR UNACCENT(name) ILIKE ? OR short_name ILIKE ? OR UNACCENT(short_name) ILIKE ?",
      "%#{name}%", "%#{name}%", "%#{name}%", "%#{name}%"
    )
  end

  def self.min_members_and_evaluated_since(min_members_count, time_since)
    speaker_ids = Speaker.speakers_evaluated_since(time_since).map { |s| s.id }

    joins(:memberships)
      .where(memberships: { until: nil, speaker_id: speaker_ids })
      .having("COUNT(memberships.id) >= ?", min_members_count)
      .group(:id)
      .order(name: :asc)
  end
end
