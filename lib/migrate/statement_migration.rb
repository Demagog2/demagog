# frozen_string_literal: true

require "date"
require_relative "./helpers/duplication_tester"

class StatementMigration
  attr_accessor :connection
  attr_accessor :quiet

  def initialize(connection, quiet)
    self.connection = connection
    self.quiet = quiet

    @tester = DuplicationTester.new
    @segment_cache = Hash.new
  end

  def perform
    old_statements = self.connection.query("SELECT * FROM vyrok")

    migrate_statements(old_statements)
    migrate_assessments(old_statements)
    migrate_segments(old_statements)
  end

  def migrate_statements(old_statements)
    keys = [
      :id,
      :source_id,
      :speaker_id,
      :content,
      :count_in_statistics,
      :important,
      :published,
      :excerpted_at,
      :source_order,
      :created_at,
      :updated_at,
      :deleted_at
    ]

    Statement.bulk_insert(*keys) do |worker|
      old_statements.each do |old_statement|
        content = migrate_statement_content old_statement["vyrok"]

        worker.add([
                     old_statement["id"],
                     old_statement["id_diskusia"],
                     @tester.duplicated_id(old_statement["id_politik"]),
                     content,
                     old_statement["evaluate"] == 1,
                     old_statement["dolezity"] == 1,
                     old_statement["status"] == 1,
                     old_statement["timestamp"],
                     old_statement["poradie"],
                     Time.now,
                     Time.now,
                     old_statement["status"] == -3 ? Time.now : nil
                   ])
      end
    end
  end

  def evaluation_status
    {
        # -3 is removed statement, which we migrate by setting deleted_at,
        # so does not really matter what the evaluation status of such
        # statements are
        -3 => Assessment::STATUS_BEING_EVALUATED,

        -2 => Assessment::STATUS_BEING_EVALUATED,
        -1 => Assessment::STATUS_APPROVAL_NEEDED,
         0 => Assessment::STATUS_APPROVED,
         1 => Assessment::STATUS_APPROVED
    }
  end


  def migrate_assessments(old_statements)
    keys = [
      :statement_id,
      :explanation_html,
      :veracity_id,
      :evaluation_status,
      :user_id,
      :evaluated_at,
      :created_at,
      :updated_at
    ]

    Assessment.bulk_insert(*keys) do |worker|
      old_statements.each do |old_statement|
        veracity_id = nil
        if old_statement["id_pravdivostna_hodnota"]
          veracity_id = old_statement["id_pravdivostna_hodnota"]
        end

        worker.add([
          old_statement["id"],
          old_statement["odovodnenie"],
          veracity_id,
          evaluation_status[old_statement["status"]],
          old_statement["id_user"],
          old_statement["timestamp"],
          Time.now,
          Time.now
        ])
      end
    end
  end

  def dependency_to_segment(source_id)
    return @segment_cache[source_id] if @segment_cache[source_id]

    article_has_segment = ArticleHasSegment.find_by(article: source_id)

    if article_has_segment
      @segment_cache[source_id] = article_has_segment.segment
    else
      article = Article.find(source_id)

      raise "Article #{source_id} not found" unless article

      segment = Segment.create!(
        segment_type: Segment::TYPE_STATEMENTS_SET
      )

      @segment_cache[source_id] = segment

      ArticleHasSegment.create!(
        article: article,
        segment: segment,
        order: 1
      )

      segment
    end
  end

  def migrate_segments(old_statements)
    keys = [
      :segment_id,
      :statement_id,
      :created_at,
      :updated_at
    ]

    SegmentHasStatement.bulk_insert(*keys) do |worker|
      old_statements.each do |old_statement|
        segment = dependency_to_segment(old_statement["id_diskusia"])

        worker.add([
          segment.id,
          old_statement["id"],
          Time.now,
          Time.now
        ])
      end
    end
  end

  def migrate_statement_content(old_content)
    # First remove old newlines, which did not do anything, because statements
    # were rendered as html
    content = old_content.gsub(/(?:\r\n|\r|\n)/, " ")

    # Then replace all existing <br> tags with newlines
    content = content.gsub(/(?:<br>|<BR>|<\/br>)/, "\n")

    # If there are any spaces before or after newline, remove them
    content = content.gsub(/(?: \n|\n )/, "\n")

    # And remove all other <i> tags
    content.gsub(/(<i>|<\/i>)/, "")
  end
end
