# frozen_string_literal: true

class GenerateStatementPreviewImageWorker
  include Sidekiq::Worker
  sidekiq_options retry: 5

  def perform(statement_id, debug = false)
    GenerateStatementPreviewImageService.generate(statement_id, debug)
  end
end
