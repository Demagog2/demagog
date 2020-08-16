# frozen_string_literal: true

class Admin::ExportController < ApplicationController
  before_action :authenticate_user!

  def factual_statements
    @statements = Statement.factual_and_published.includes(:speaker, :assessment, :tags, :source, assessment: [:veracity], source: [:medium, :media_personalities])

    respond_to do |format|
      format.xlsx {
        response.headers["Content-Disposition"] = 'attachment; filename="Výroky Demagog.cz.xlsx"'
      }
    end
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
        response.headers["Content-Disposition"] = 'attachment; filename="Řečníci na Demagog.cz.xlsx"'
      }
    end
  end
end
