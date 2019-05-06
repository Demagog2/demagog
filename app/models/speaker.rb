# frozen_string_literal: true

class Speaker < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_one :current_membership, -> { current }, class_name: "Membership"
  has_one :body, through: :current_membership
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
      .where("statements.statement_type = ?", Statement::TYPE_FACTUAL)
      .group("speakers.id")
      .order("statements_count DESC")
      .limit(8)
  end

  def self.active_members_of_body(body_id)
    joins(:memberships)
      .where(memberships: { body_id: body_id, until: nil })
  end

  def self.matching_name(name)
    where(
      "first_name || ' ' || last_name ILIKE ? OR UNACCENT(first_name || ' ' || last_name) ILIKE ?",
      "%#{name}%",
      "%#{name}%"
    )
  end

  def factual_and_published_statements
    statements.factual_and_published
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  def factual_and_published_statements_by_veracity(veracity_id)
    statements
      .factual_and_published
      .where(assessments: {
        veracity_id: veracity_id
      })
  end
end
