# frozen_string_literal: true

class Speaker < ApplicationRecord
  has_many :memberships
  has_many :parties, through: :memberships
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
      .limit(5)
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

  def party
    current = memberships.current

    if current.respond_to?(:party)
      current.party
    else
      nil
    end
  end

  def stats_for_debate(source)
    build_stats statements.relevant_for_statistics.where(source_id: source.id)
  end

  def stats
    build_stats statements.relevant_for_statistics
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

  private
    def build_stats(statements)
      correct_assessments = Assessment
        .includes(:veracity)
        .where(statement: statements)
        .where(evaluation_status: Assessment::STATUS_CORRECT)

      correct_assessments.reduce(empty_stats) do |acc, assessment|
        acc[assessment.veracity.key.to_sym] += 1
        acc
      end
    end

    def empty_stats
      Veracity.all.reduce({}) do |acc, veracity|
        acc[veracity.key.to_sym] = 0
        acc
      end
    end
end
