# frozen_string_literal: true

class SpeakerController < FrontendController
  def index
    @speakers = Speaker.top_speakers
    @parties = Body.min_members_and_evaluated_since(1, 18.months.ago)

    @party = Body.find(params[:id]) if params[:id]
  end

  def show
    # We first try to match /politici/jan-novak-123
    match = params[:slug].match(/-(\d+)$/)
    if !match
      # If we did not get the first match, then we try the old /politici/123
      match = params[:slug].match(/^(\d+)$/)
    end
    return head :not_found unless match

    speaker = Speaker.find_by(id: match[1])
    return head :not_found unless speaker

    # If the current slug is different for example because the name changed,
    # we want to redirect to the new canonical one
    return redirect_to speaker_path(speaker, params: request.query_parameters), status: 301 if speaker.slug != params[:slug]

    # Seznam links to /politici/123?veracity=1, so we need to redirect to the new format
    if !params[:veracity].nil? && params[:veracity].match(/^\d+$/)
      veracity_id = params[:veracity].to_i

      veracity_value = {
        1 => "pravda",
        2 => "nepravda",
        3 => "zavadejici",
        4 => "neoveritelne"
      }.fetch(veracity_id, nil)

      if veracity_value
        new_params = request.query_parameters.merge({ hodnoceni: veracity_value }).except(:veracity)
        return redirect_to speaker_path(speaker, params: new_params), status: 301
      end
    end

    @speaker = speaker
    @params = params
  end
end
