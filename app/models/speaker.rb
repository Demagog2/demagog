# frozen_string_literal: true

class Speaker < ApplicationRecord
  include Searchable

  after_create  { ElasticsearchWorker.perform_async(:speaker, :index,  self.id) }
  after_update  { ElasticsearchWorker.perform_async(:speaker, :update,  self.id) }
  after_destroy { ElasticsearchWorker.perform_async(:speaker, :destroy,  self.id) }

  has_many :memberships, dependent: :destroy
  has_one :current_membership, -> { current }, class_name: "Membership"
  has_one :body, through: :current_membership
  has_many :bodies, through: :memberships
  has_many :statements
  has_many :assessments, through: :statements
  has_and_belongs_to_many :sources

  has_one_attached :avatar

  mapping do
    indexes :id, type: "long"
    ElasticMapping.indexes_name_field self, :full_name
    indexes :factual_and_published_statements_count, type: "long"
  end

  def as_indexed_json(options = {})
    as_json(
      only: [:id, :full_name, :factual_and_published_statements_count],
      methods: [:full_name, :factual_and_published_statements_count]
    )
  end

  def self.query_search(query)
    search(
      query: {
        bool: {
          must: { simple_query_string: simple_query_string_defaults.merge(query: query) }
        }
      },
      sort: [
        { factual_and_published_statements_count: { order: "desc" } }
      ]
    )
  end

  def self.top_speakers
    speakers_evaluated_since(6.months.ago)
      .order("statements_count DESC")
      .limit(8)
  end

  def self.speakers_evaluated_since(time_since)
    joins(:statements)
      .select("speakers.*, COUNT(statements.id) as statements_count")
      .where("statements.excerpted_at >= ?", time_since)
      .where("statements.published = ?", true)
      .where("statements.statement_type = ?", Statement::TYPE_FACTUAL)
      .group("speakers.id")
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

  def self.with_factual_and_published_statements
    speaker_ids = Statement.factual_and_published.map { |statement| statement.speaker_id }.uniq

    where("speakers.id IN (?)", speaker_ids)
  end

  def factual_and_published_statements
    statements.factual_and_published
  end

  def factual_and_published_statements_count
    factual_and_published_statements.count
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

  def stats
    SpeakerStat.where(speaker_id: id).normalize
  end
end
