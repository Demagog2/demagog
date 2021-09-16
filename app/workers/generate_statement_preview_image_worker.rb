# frozen_string_literal: true

class GenerateStatementPreviewImageWorker
  include Sidekiq::Worker
  sidekiq_options retry: 5

  def perform(statement_id)
    GenerateStatementPreviewImageService.generate(statement_id)
  end
end
