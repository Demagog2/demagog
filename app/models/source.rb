# frozen_string_literal: true

require "addressable/uri"
require "nokogiri"

class Source < ApplicationRecord
  include Discardable

  enum video_type: { facebook: "facebook", youtube: "youtube", audio: "audio" }
  has_many :article_segments
  has_many :statements
  has_many :statement_video_marks
  has_many :statement_transcript_positions
  has_many :source_speakers
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

  def internal_stats
    all_links = []

    statements.published.each do |statement|
      doc = Nokogiri::HTML(statement.assessment.explanation_html)
      links = doc.css("a")

      links.each do |link|
        all_links.push({
          statement: statement,
          host: Addressable::URI.parse(link["href"].strip).host,
          link: link["href"].strip
        })
      end
    end

    grouped_by_link = {}
    all_links.each do |link|
      grouped_by_link[link[:link]] = 0 unless grouped_by_link.key?(link[:link])
      grouped_by_link[link[:link]] += 1
    end
    grouped_by_link = grouped_by_link.map do |link, count|
      { link: link, count: count }
    end
    grouped_by_link = grouped_by_link.sort_by { |item| -item[:count] }

    grouped_by_host = {}
    all_links.each do |link|
      grouped_by_host[link[:host]] = 0 unless grouped_by_host.key?(link[:host])
      grouped_by_host[link[:host]] += 1
    end
    grouped_by_host = grouped_by_host.map do |host, count|
      { host: host, count: count }
    end
    grouped_by_host = grouped_by_host.sort_by { |item| -item[:count] }

    {
      all_links_count: all_links.size,
      grouped_by_link: grouped_by_link,
      grouped_by_host: grouped_by_host
    }
  end
end
