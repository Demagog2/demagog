# frozen_string_literal: true

class Speaker < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_many :bodies, through: :memberships
  has_many :statements
  has_many :assessments, through: :statements
  has_and_belongs_to_many :sources

  has_one_attached :avatar

  def self.top_speakers
    joins(:statements)
      .select("speakers.*, COUNT(statements.id) as statements_count")
      .where("statements.excerpted_at >= ?", 6.months.ago)
      .where("statements.published = ?", true)
      .group("speakers.id")
      .order("statements_count DESC")
      .limit(8)
  end

  def self.active_members_of_body(body_id)
    joins(:memberships)
      .where(memberships: { body_id: body_id, until: nil })
  end

  def self.matching_name(name)
    where("first_name LIKE ? OR last_name LIKE ?", "%#{name}%", "%#{name}%")
  end

  def published_statements
    statements.published
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  def body
    current = memberships.current

    if current.respond_to?(:body)
      current.body
    else
      nil
    end
  end

  def statements_by_veracity(veracity_id)
    statements
      .published
      .joins(:assessments)
      .where(assessments: {
        evaluation_status: Assessment::STATUS_CORRECT,
        veracity_id: veracity_id
      })
  end
end
