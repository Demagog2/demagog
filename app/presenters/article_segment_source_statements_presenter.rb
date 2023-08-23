# frozen_string_literal: true

class ArticleSegmentSourceStatementsPresenter
  attr_accessor :statements, :tags_with_counts, :veracities_with_counts

  TagWithCount = Struct.new(:tag, :count)
  VeracityWithCount = Struct.new(:veracity_key, :veracity_name, :count)

  def initialize(segment)
    @segment = segment

    @statements = init_statements()
    @tags_with_counts = init_tags_with_counts()
    @veracities_with_counts = init_veracities_with_counts()
  end

  def init_statements
    @segment
      .source
      .statements
      .published_important_first
      .includes(
        :assessment,
        { assessment: :veracity },
        :source_speaker,
        { source_speaker: [:body, :speaker] },
        :tags
      )
  end

  def init_tags_with_counts
    tag_id_counts = {}

    @statements.each do |statement|
      statement.tags.each do |tag|
        tag_id_counts[tag.id] = 0 unless tag_id_counts.has_key?(tag.id)
        tag_id_counts[tag.id] += 1
      end
    end

    tags = Tag.where(id: tag_id_counts.map { |tag_id, count| tag_id }).order(Arel.sql("name COLLATE \"cs_CZ\" ASC"))

    tags.map do |tag|
      TagWithCount.new(tag, tag_id_counts[tag.id])
    end
  end

  def init_veracities_with_counts
    veracity_key_counts = {
      Assessment::VERACITY_TRUE => 0,
      Assessment::VERACITY_UNTRUE => 0,
      Assessment::VERACITY_MISLEADING => 0,
      Assessment::VERACITY_UNVERIFIABLE => 0,
    }

    @statements.each do |statement|
      veracity = statement.assessment.veracity_new

      veracity_key_counts[veracity] += 1
    end

    veracity_key_counts.map do |veracity_key, count|
      VeracityWithCount.new(veracity_key, I18n.t("veracity.names.#{veracity_key}"), count)
    end
  end
end
