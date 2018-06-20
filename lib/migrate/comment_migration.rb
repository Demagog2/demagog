# frozen_string_literal: true

class CommentMigration
  attr_accessor :connection

  def initialize(connection)
    self.connection = connection
  end

  def perform
    old_statement_comments = self.connection.query("SELECT * FROM comments WHERE kategoria = 4")

    Comment.bulk_insert(:content, :user_id, :statement_id, :created_at, :updated_at) do |worker|
      old_statement_comments.each do |old_statement_comment|
        created_at = Time.at(old_statement_comment["time"])

        worker.add([
          old_statement_comment["komentar"],
          old_statement_comment["user"],
          old_statement_comment["remoteid"],
          created_at,
          created_at,
        ])
      end
    end
  end
end
