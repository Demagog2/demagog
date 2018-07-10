# frozen_string_literal: true

class ArticleTypeMigration
  attr_accessor :connection
  attr_accessor :quiet

  def initialize(connection, quiet)
    self.connection = connection
    self.quiet = quiet
  end

  def perform
    ArticleType.bulk_insert(:name, :created_at, :updated_at) do |worker|
      worker.add(["default", Time.now, Time.now])
      worker.add(["static", Time.now, Time.now])
    end
  end
end
