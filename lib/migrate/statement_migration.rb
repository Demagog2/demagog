# frozen_string_literal: true

require "date"
require "ruby-progressbar/outputs/null"

require_relative "./helpers/duplication_tester"
require_relative "./helpers/html_content_helper"
require_relative "./helpers/image_url_helper"

# These images are in statement explanation and do not exist on demagog
# anymore, so we just ignore them
NON_EXISTING_CONTENT_IMAGES = ["/data/images/jjj.jpg"]

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
    migrate_images_in_explanation()
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
          HtmlContentHelper.to_clean_html(old_statement["odovodnenie"]),
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

    segment = Segment.find_by(article: source_id)

    if segment
      @segment_cache[source_id] = segment
    else
      article = Article.find(source_id)

      raise "Article #{source_id} not found" unless article

      segment = Segment.create!(
        segment_type: Segment::TYPE_STATEMENTS_SET
      )

      article.segments << segment

      segment
    end
  end

  def migrate_images_in_explanation
    statements = Statement.unscoped.includes(:assessment)

    progressbar = ProgressBar.create(
      format: "Migrating statement explanation content images: %e |%b>>%i| %p%% %t",
      total: statements.size,
      output: quiet ? ProgressBar::Outputs::Null : $stdout
    )

    statements.each do |statement|
      assessment = statement.assessment
      img_src_matches = assessment.explanation_html.scan(/<img[^>]*src="([^"]+)"[^>]*>/)

      img_src_matches.each do |img_src_match|
        src = img_src_match[0]

        is_demagog_upload_image = src.starts_with?("/data/images/") ||
          src.starts_with?("http://demagog.cz/data/images/") ||
          src.starts_with?("http://legacy.demagog.cz/data/images/")

        next unless is_demagog_upload_image

        path = src[/\/data\/images\/.*$/]
        filename = path.match(/\/data\/images\/(.*)/)[1]

        next if NON_EXISTING_CONTENT_IMAGES.include?(path)

        content_image = ContentImage.create!(created_at: statement.excerpted_at)

        ImageUrlHelper.open_image(path) do |file|
          content_image.image.attach io: file, filename:
        end

        # Using polymorphic_url as it is the same as url_for, but allows
        # generating only the path of url without host. Not using
        # rails_blob_path, because url_for generates the permanent link
        # decoupled from where the file actually is.
        # See http://edgeguides.rubyonrails.org/active_storage_overview.html#linking-to-files
        src_new = Rails.application.routes.url_helpers.polymorphic_url(content_image.image, only_path: true)

        assessment.explanation_html = assessment.explanation_html.gsub(src, src_new)
      end

      assessment.save!
      progressbar.increment
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
