# frozen_string_literal: true

class Source < ApplicationRecord
  include Discardable

  has_many :article_segments
  has_many :statements
  has_many :statement_transcript_positions
  has_and_belongs_to_many :speakers
  belongs_to :medium, optional: true
  has_and_belongs_to_many :media_personalities, join_table: "sources_media_personalities"
  has_and_belongs_to_many :experts, class_name: "User", join_table: "sources_experts"

  default_scope { kept }

  def self.matching_name(name)
    where("name ILIKE ? OR UNACCENT(name) ILIKE ?", "%#{name}%", "%#{name}%")
  end

  def update_statements_source_order(ordered_statement_ids)
    Source.transaction do
      statements.update_all(source_order: nil)

      unless ordered_statement_ids.nil?
        ordered_statement_ids.each_with_index do |statement_id, index|
          self.statements.find(statement_id).update!(source_order: index)
        end
      end
    end

    statements.reload
    self
  end

  def publish_approved_statements
    Source.transaction do
      approved_unpublished_statements = statements
        .where(published: false)
        .joins(:assessment)
        .where(assessments: {
          evaluation_status: Assessment::STATUS_APPROVED
        })

      approved_unpublished_statements.update_all(published: true)

      statements.reload
      self
    end
  end
end
