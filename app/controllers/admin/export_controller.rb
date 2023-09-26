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
      carry[statement.source_speaker_id] = 0 unless carry.key?(statement.source_speaker_id)
      carry[statement.source_speaker_id] += 1
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
      .where("assessments.evaluator_first_assigned_at IS NOT NULL")
      .where("assessments.evaluation_started_at IS NOT NULL")
      .where("assessments.first_requested_approval_at IS NOT NULL")
      .where("assessments.first_requested_proofreading_at IS NOT NULL")
      .where("assessments.first_approved_at IS NOT NULL")

    @statements_stats = {}
    @statements.each do |statement|
      @statements_stats[statement.id] = {
        evaluator_first_assigned_mins: ((statement.assessment.evaluator_first_assigned_at - statement.created_at) / 60).round,
        evaluation_started_mins: ((statement.assessment.evaluation_started_at - statement.assessment.evaluator_first_assigned_at) / 60).round,
        first_requested_approval_mins: ((statement.assessment.first_requested_approval_at - statement.assessment.evaluation_started_at) / 60).round,
        first_requested_proofreading_mins: ((statement.assessment.first_requested_proofreading_at - statement.assessment.first_requested_approval_at) / 60).round,
        first_approved_mins: ((statement.assessment.first_approved_at - statement.assessment.first_requested_proofreading_at) / 60).round
      }
    end

    sources_data = {}
    @statements.each do |statement|
      unless sources_data.has_key?(statement.source.id)
        sources_data[statement.source.id] = {
          source: statement.source,
          evaluator_first_assigned_mins: [],
          evaluation_started_mins: [],
          first_requested_approval_mins: [],
          first_requested_proofreading_mins: [],
          first_approved_mins: []
        }
      end

      sources_data[statement.source.id][:evaluator_first_assigned_mins].push(@statements_stats[statement.id][:evaluator_first_assigned_mins])
      sources_data[statement.source.id][:evaluation_started_mins].push(@statements_stats[statement.id][:evaluation_started_mins])
      sources_data[statement.source.id][:first_requested_approval_mins].push(@statements_stats[statement.id][:first_requested_approval_mins])
      sources_data[statement.source.id][:first_requested_proofreading_mins].push(@statements_stats[statement.id][:first_requested_proofreading_mins])
      sources_data[statement.source.id][:first_approved_mins].push(@statements_stats[statement.id][:first_approved_mins])
    end

    @sources_stats = sources_data.values.map do |item|
      {
        source: item[:source],
        evaluator_first_assigned_mins: item[:evaluator_first_assigned_mins].sum / item[:evaluator_first_assigned_mins].size.to_f,
        evaluation_started_mins: item[:evaluation_started_mins].sum / item[:evaluation_started_mins].size.to_f,
        first_requested_approval_mins: item[:first_requested_approval_mins].sum / item[:first_requested_approval_mins].size.to_f,
        first_requested_proofreading_mins: item[:first_requested_proofreading_mins].sum / item[:first_requested_proofreading_mins].size.to_f,
        first_approved_mins: item[:first_approved_mins].sum / item[:first_approved_mins].size.to_f
      }
    end

    respond_to do |format|
      format.xlsx {
        response.headers["Content-Disposition"] = 'attachment; filename="Demagog_cz - Výroky s čísly o délce ověřování.xlsx"'
      }
    end
  end
end
