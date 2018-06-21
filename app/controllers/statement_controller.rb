# frozen_string_literal: true

class StatementController < ApplicationController
  def show
    @statement = Statement.published.find(params[:id])

    @stats = speaker_stats.build(@statement.speaker)
  end
end
