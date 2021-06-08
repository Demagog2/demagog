# frozen_string_literal: true

class GenerateStatementPreviewImageWorker
  include Sidekiq::Worker

  def perform(statement_id)
    GenerateStatementPreviewImageService.generate(statement_id)
  end
end
