# frozen_string_literal: true

class SpeakerController < FrontendController
  def index
    @speakers = Speaker.top_speakers
    @parties = Body.min_members_and_evaluated_since(1, 18.months.ago)

    @party = Body.find(params[:id]) if params[:id]
  end

  def show
    @speaker = Speaker.find(params[:id])

    @statements = get_speaker_statements(@speaker)
  end

  private
    def get_speaker_statements(speaker)
      statements = if params[:veracity]
        speaker.factual_and_published_statements_by_veracity(params[:veracity])
      else
        speaker.factual_and_published_statements
      end

      # We just sort the statements by release date of source first, and then
      # for the same source the statements are sorted by the usual ordering
      statements = statements
        .reorder(nil)
        .joins(:source)
        .order("sources.released_at" => :desc)
        .ordered

      statements.page(params[:page])
    end
end
