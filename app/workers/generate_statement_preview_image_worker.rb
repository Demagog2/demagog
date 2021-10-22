# frozen_string_literal: true

class GenerateStatementPreviewImageWorker
  include Sidekiq::Worker
  sidekiq_options retry: 5

  def perform(statement_id, debug = false)
    statement = Statement.find_by(id: statement_id)

    if !statement || !statement.published
      # The statement might have been deleted or unpublished in the meantime,
      # in that case we dont do anything, because if it gets published again,
      # new worker will get spawned
      return
    end

    GenerateStatementPreviewImageService.generate(statement_id, debug)
  end
end
