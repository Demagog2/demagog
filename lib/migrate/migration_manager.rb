# frozen_string_literal: true

require_relative "./article_migration"
require_relative "./article_type_migration"
require_relative "./comment_migration"
require_relative "./medium_migration"
require_relative "./membership_migration"
require_relative "./body_migration"
require_relative "./source_migration"
require_relative "./speaker_migration"
require_relative "./statement_migration"
require_relative "./veracity_migration"
require_relative "./user_migration"

class MigrationManager
  attr_accessor :connection
  attr_accessor :quiet

  def initialize(connection, quiet)
    self.connection = connection
    self.quiet = quiet
  end

  def perform
    tasks = [
      ArticleTypeMigration,
      ArticleMigration,
      CommentMigration,
      VeracityMigration,
      BodyMigration,
      SpeakerMigration,
      MediumMigration,
      SourceMigration,
      StatementMigration,
      MembershipMigration,
      UserMigration
    ]

    tasks.each do |task|
      puts "=== #{task.name} starting ===" unless quiet

      task.new(connection, quiet).perform

      puts "=== #{task.name} done ===" unless quiet
    end
  end
end
