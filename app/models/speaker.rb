# frozen_string_literal: true

class Speaker < ApplicationRecord
  has_many :memberships
  has_many :bodies, through: :memberships
  has_many :statements
  has_many :assessments, through: :statements
  belongs_to :attachment

  def self.top_speakers
    joins(:statements)
      .select("speakers.*, COUNT(statements.id) as statements_count")
      .where("statements.excerpted_at >= ?", 6.months.ago)
      .where("statements.published = ?", true)
      .group("speakers.id")
      .order("statements_count DESC")
      .limit(8)
  end

  def published_statements
    statements.published
  end

  def portrait
    attachment
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
