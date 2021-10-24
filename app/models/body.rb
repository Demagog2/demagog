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

  def slug
    "#{name.parameterize}-#{id}"
  end

  def self.matching_name(name)
    where(
      "name ILIKE ? OR UNACCENT(name) ILIKE ? OR short_name ILIKE ? OR UNACCENT(short_name) ILIKE ?",
      "%#{name}%", "%#{name}%", "%#{name}%", "%#{name}%"
    )
  end

  # TODO: move to database and build admin for it
  def self.get_lower_parliament_body_ids
    [
      1, # ODS
      2, # TOP09
      7, # KDU-CSL
      12, # Pirati
      30, # ANO
      32, # STAN
      53 # SPD
    ]
  end
end
