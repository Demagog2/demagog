# frozen_string_literal: true

class SpeakerElasticFilterableListPresenter
  attr_accessor :parsed_params_filters, :unfiltered_total, :filter_options

  def initialize(params:)
    @params = params

    @parsed_params_filters = parse_params_filters()
    @elastic_response = elastic_search()
    @unfiltered_total = get_unfiltered_total()
    @filter_options = get_filter_options()
  end

  def paginated_speakers
    @elastic_response.per(24).records
  end

  def filtered_total
    @elastic_response.results.total
  end

  def president_and_government_speakers
    # Using .map to keep the order of speakers from the list of ids
    speakers = Speaker.get_most_important_speaker_ids.map do |speaker_id|
      Speaker.find_by(id: speaker_id)
    end

    # If we did not find some speaker then just dont show them
    speakers.select { |speaker| !speaker.blank? }
  end

  private
    def parse_params_filters
      params_filters = {}

      # Body
      if !@params[:strana].blank?
        params_strana = @params[:strana].kind_of?(Array) ? @params[:strana] : [@params[:strana]]

        body_ids = params_strana.map { |item| item[/-(\d+)$/, 1] }
        body_ids = body_ids.filter { |item| !item.nil? }

        if !body_ids.empty?
          params_filters[:body_id] = body_ids.map { |body_id| body_id.to_i }
        end
      end

      # Fulltext
      if !@params[:q].blank?
        params_filters[:query] = @params[:q]
      end

      params_filters
    end

    def elastic_search
      filters = {}.merge(@parsed_params_filters)

      # We filter the president and government out when no filters are used because those are pinned at top
      if filters.empty?
        filters = filters.merge({ not_speaker_ids: Speaker.get_most_important_speaker_ids })
      end

      page = @params[:page] || 1

      SpeakersElasticQueryService.search_all(filters).page(page)
    end

    def get_unfiltered_total
      SpeakersElasticQueryService.search_all({}).results.total
    end

    def get_filter_options
      filter_options = {}

      aggregations = SpeakersElasticQueryService.aggregate_all({})

      # Body
      body_id_aggregation = aggregations.fetch("body_id", {})
      lower_parliament_body_ids = Body.get_lower_parliament_body_ids

      body_id_filter_options = Body.where(id: body_id_aggregation.keys).order(Arel.sql("name COLLATE \"cs_CZ\" ASC")).map do |body|
        {
          value: "#{body.short_name.parameterize}-#{body.id}",
          label: "#{body.name}" + (body.name != body.short_name ? " (#{body.short_name})" : ""),
          count: body_id_aggregation[body.id],
          selected: @parsed_params_filters[:body_id] && @parsed_params_filters[:body_id].include?(body.id),
          group_name: lower_parliament_body_ids.include?(body.id) ? "Strany a hnutí v Poslanecké sněmovně Parlamentu ČR" : "Další strany a hnutí"
        }
      end

      body_id_filter_options_groups = ["Strany a hnutí v Poslanecké sněmovně Parlamentu ČR", "Další strany a hnutí"].map do |group_name|
        {
          group_name:,
          filter_options: body_id_filter_options.select { |body| body[:group_name] == group_name }
        }
      end

      filter_options[:body_id] = body_id_filter_options_groups

      filter_options
    end
end
