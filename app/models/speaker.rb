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
  has_many :source_speakers, dependent: :destroy
  has_many :statements, through: :source_speakers
  has_many :assessments, through: :statements

  has_one_attached :avatar

  mapping do
    indexes :id, type: "long"
    ElasticMapping.indexes_name_field self, :full_name
    indexes :sort_name, type: "keyword"
    ElasticMapping.indexes_text_field self, :role
    indexes :body do
      indexes :id, type: "long"
      ElasticMapping.indexes_name_field self, :name
      ElasticMapping.indexes_name_field self, :short_name
    end
    indexes :factual_and_published_statements_count, type: "long"
  end

  def as_indexed_json(options = {})
    as_json(
      only: [:id, :full_name, :sort_name, :role, :factual_and_published_statements_count],
      methods: [:full_name, :sort_name, :factual_and_published_statements_count],
      include: {
        body: {
          only: [:id, :name, :short_name]
        }
      }
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
    speaker_ids = Statement.factual_and_published.map { |statement| statement.source_speaker.speaker_id }.uniq

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

  def sort_name
    "#{last_name} #{first_name}"
  end

  def slug
    "#{full_name.parameterize}-#{id}"
  end

  # Used by *_path and *_url helpers to build the url
  def to_param
    slug
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

  # TODO: Remove hardcoded values and add to database with editable admin ui
  def self.get_most_important_speaker_ids
    [
      # president
      168, # Milos Zeman

      # government
      183, # Andrej Babis
      41, # Jan Hamacek
      495, # Alena Schillerova
      496, # Karel Havlicek
      # Jakub Kulhanek (not currently among speakers)
      497, # Lubomir Metnar
      215, # Marie Benesova
      444, # Richard Brabec
      498, # Jana Malacova
      218, # Miroslav Toman
      490, # Robert Plaga
      479, # Klara Dostalova
      500, # Adam Vojtech
      1, # Lubomir Zaoralek

      # leaders of parties in lower house of parliament, sorted by number of MPs
      # ANO, Andrej Babis (already in government)
      67, # ODS, Petr Fiala
      506, # STAN, Vit Rakusan
      133, # KDU-CSL, Marian Jurecka
      180, # SPD, Tomio Okamura
      502, # TOP 09, Marketa Pekarova Adamova
      76 # Pirati, Ivan Bartos
    ]
  end
end
