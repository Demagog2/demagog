# frozen_string_literal: true

class Admin::ExportController < ApplicationController
  before_action :authenticate_user!

  skip_before_action :verify_authenticity_token, only: [:mail_factual_statements]

  def mail_factual_statements
    MailExportWorker.perform_async("factual_statements", current_user.email)

    head :ok
  end

  def speakers
    @speakers = Speaker.with_factual_and_published_statements
    @statement_counts_by_speaker_id = Statement.factual_and_published.reduce({}) do |carry, statement|
      carry[statement.speaker_id] = 0 unless carry.key?(statement.speaker_id)
      carry[statement.speaker_id] += 1
      carry
    end

    respond_to do |format|
      format.xlsx {
        response.headers["Content-Disposition"] = 'attachment; filename="Demagog_cz - Řečníci a jejich počty výroků.xlsx"'
      }
    end
  end

  def statements_evaluation_process
    @statements = Statement.factual_and_published
      .where('assessments.evaluator_first_assigned_at IS NOT NULL')
      .where('assessments.evaluation_started_at IS NOT NULL')
      .where('assessments.first_requested_approval_at IS NOT NULL')
      .where('assessments.first_requested_proofreading_at IS NOT NULL')
      .where('assessments.first_approved_at IS NOT NULL')

    respond_to do |format|
      format.xlsx {
        response.headers["Content-Disposition"] = 'attachment; filename="Demagog_cz - Výroky s čísly o délce ověřování.xlsx"'
      }
    end
  end
end
