# frozen_string_literal: true

class Source < ApplicationRecord
  belongs_to :medium, optional: true
  has_many :articles
  has_many :statements
  has_many :statement_transcript_positions
  has_and_belongs_to_many :speakers
  belongs_to :media_personality, optional: true

  default_scope { where(deleted_at: nil) }

  def self.matching_name(name)
    where("name LIKE ?", "%#{name}%")
  end

  def regenerate_statements_order
    sorted = statements
      .unscoped
      .where(source: self)
      .where(deleted_at: nil)
      .left_outer_joins(:statement_transcript_position)
      .order(
        "statement_transcript_positions.start_line ASC",
        "statement_transcript_positions.start_offset ASC",
        "excerpted_at ASC"
      )

    puts "======================"
    puts sorted.inspect

    Source.transaction do
      sorted.each_with_index do |statement, index|
        puts "-----------------"
        puts statement.id.inspect
        puts index.inspect
        statement.update!(source_order: index)
      end
    end
  end
end
