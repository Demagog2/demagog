# frozen_string_literal: true

class SourceSegments < ActiveRecord::Migration[5.2]
  def change
    # We are dropping the statements_set segment for now in favor
    # of source_statements segment, so we don't need relation between
    # statements and segment
    drop_table :segment_has_statements

    # If segment is source_statements type, it will have source_id set,
    # specifying the source to take statements from
    add_column :segments, :source_id, :bigint

    # We use the article.source_id to populate source_statements segments
    # field source_id
    Article.unscoped.each do |article|
      article.segments.each do |segment|
        if segment.segment_type == "statements_set" && article.source_id
          segment.source_id = article.source_id
          segment.segment_type = "source_statements"
          segment.save!
        end
      end
    end

    # Some statements_set segments were not connected to articles with
    # source_id, lets just remove those segments
    Segment.where(segment_type: "statements_set").each do |segment|
      segment.article_has_segments.delete_all
      segment.delete
    end

    # We won't need the source_id on article anymore
    remove_column :articles, :source_id, :bigint
  end
end
