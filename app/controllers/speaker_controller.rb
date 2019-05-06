# frozen_string_literal: true

class SpeakerController < ApplicationController
  def index
    @speakers = Speaker.top_speakers
    @parties = Body.min_members(3)

    @party = Body.find(params[:id]) if params[:id]
  end

  def show
    @speaker = Speaker.find(params[:id])

    @statements = get_speaker_statements(@speaker)

    @stats = speaker_stats.build(@speaker)

    @veracities = Veracity.all
  end

  private
    def get_speaker_statements(speaker)
      statements = if params[:veracity]
        speaker.factual_and_published_statements_by_veracity(params[:veracity])
      else
        speaker.factual_and_published_statements
      end

      statements.page(params[:page])
    end
end
