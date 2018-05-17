# frozen_string_literal: true

class Body < ApplicationRecord
  has_many :memberships
  has_many :speakers, through: :memberships
  belongs_to :attachment, optional: true

  has_one_attached :logo

  def current_members
    speakers
      .where(memberships: { until: nil })
      .order(last_name: :asc)
  end

  def self.min_members(count)
    joins(:memberships)
      .where(memberships: { until: nil })
      .having("COUNT(memberships.id) > ?", count)
      .group(:id)
      .order(name: :asc)
  end
end
