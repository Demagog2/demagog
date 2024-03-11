# frozen_string_literal: true

class StatementElasticFilterableListPresenter
  attr_accessor :parsed_params_filters, :unfiltered_total, :filter_options

  def initialize(context:, enable_filters:, params:)
    @context = context
    @enable_filters = enable_filters
    @params = params

    @parsed_params_filters = parse_params_filters()
    @elastic_response = elastic_search()
    @unfiltered_total = get_unfiltered_total()
    @filter_options = get_filter_options()
  end

  def paginated_statements
    @elastic_response.records
  end

  def filtered_total
    @elastic_response.results.total
  end

  private
    def parse_params_filters
      params_filters = {}

      # Body
      if @enable_filters.include?(:body_id) && !@params[:strana].blank?
        params_strana = @params[:strana].kind_of?(Array) ? @params[:strana] : [@params[:strana]]

        body_ids = params_strana.map { |item| item[/-(\d+)$/, 1] }
        body_ids = body_ids.filter { |item| !item.nil? }

        if !body_ids.empty?
          params_filters[:body_id] = body_ids.map { |body_id| body_id.to_i }
        end
      end

      # Speaker
      if @enable_filters.include?(:speaker_id) && !@params[:politik].blank?
        params_politik = @params[:politik].kind_of?(Array) ? @params[:politik] : [@params[:politik]]

        speaker_ids = params_politik.map { |item| item[/-(\d+)$/, 1] }
        speaker_ids = speaker_ids.filter { |item| !item.nil? }

        if !speaker_ids.empty?
          params_filters[:speaker_id] = speaker_ids.map { |speaker_id| speaker_id.to_i }
        end
      end


      # Fulltext
      if @enable_filters.include?(:fulltext) && !@params[:q].blank?
        params_filters[:query] = @params[:q]
      end

      # Tag
      if @enable_filters.include?(:tag_id) && !@params[:tema].blank?
        params_tema = @params[:tema].kind_of?(Array) ? @params[:tema] : [@params[:tema]]

        tag_ids = params_tema.map { |item| item == "neurcene" ? -1 : item[/-(\d+)$/, 1] }
        tag_ids = tag_ids.filter { |item| !item.nil? }

        if !tag_ids.empty?
          params_filters[:tag_id] = tag_ids.map { |tag_id| tag_id.to_i }
        end
      end

      # Veracity
      if @enable_filters.include?(:veracity_key) && !@params[:hodnoceni].blank?
        params_veracity_keys = Array.wrap(@params[:hodnoceni])

        veracity_keys = Assessment::VERACITIES.filter do |veracity_key|
          veracity_name = I18n.t("veracity.names.#{veracity_key}")

          params_veracity_keys.include?(veracity_name.parameterize)
        end

        unless veracity_keys.empty?
          params_filters[:veracity_key] = veracity_keys
        end
      end

      # year
      if @enable_filters.include?(:released_year) && !@params[:rok].blank?
        params_rok = @params[:rok].kind_of?(Array) ? @params[:rok] : [@params[:rok]]

        years = params_rok.map { |item| item[/^(\d+)$/, 1] }
        years = years.filter { |item| !item.nil? }

        if !years.empty?
          params_filters[:released_year] = years.map { |year| year.to_i }
        end
      end

      params_filters
    end

    def elastic_search
      filters = {}.merge(@context).merge(@parsed_params_filters)
      page = @params[:page] || 1

      StatementsElasticQueryService.search_published_factual(filters).page(page)
    end

    def get_unfiltered_total
      StatementsElasticQueryService.search_published_factual(@context).results.total
    end

    def get_filter_options
      filter_options = {}

      if @enable_filters.include?(:tag_id) || @enable_filters.include?(:veracity_key) || @enable_filters.include?(:released_year)
        aggregations = StatementsElasticQueryService.aggregate_published_factual(@context)

        # Body
        if @enable_filters.include?(:body_id)
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
        end

        # Speaker
        if @enable_filters.include?(:speaker_id)
          speaker_id_aggregation = aggregations.fetch("speaker_id", {})

          speakers = Speaker
            .where(id: speaker_id_aggregation.keys)
            .order(Arel.sql("last_name COLLATE \"cs_CZ\" ASC, first_name COLLATE \"cs_CZ\" ASC"))
            .includes(:body)

          speaker_id_filter_options = speakers.map do |speaker|
            {
              value: "#{speaker.full_name.parameterize}-#{speaker.id}",
              label: "#{speaker.full_name}" + (speaker.body ? " (#{speaker.body.short_name})" : ""),
              count: speaker_id_aggregation[speaker.id],
              selected: @parsed_params_filters[:speaker_id] && @parsed_params_filters[:speaker_id].include?(speaker.id)
            }
          end

          filter_options[:speaker_id] = speaker_id_filter_options
        end

        # Tags
        if @enable_filters.include?(:tag_id)
          tag_id_aggregation = aggregations.fetch("tag_id", {})
          tag_ids = tag_id_aggregation.keys.select { |tag_id| tag_id != -1 }

          tag_id_filter_options = Tag.where(id: tag_ids).map do |tag|
            {
              value: "#{tag.name.parameterize}-#{tag.id}",
              label: tag.name,
              count: tag_id_aggregation[tag.id],
              selected: @parsed_params_filters[:tag_id] && @parsed_params_filters[:tag_id].include?(tag.id)
            }
          end

          if tag_id_aggregation.key?(-1)
            tag_id_filter_options.push({
              value: "neurcene",
              label: "Bez tématu",
              count: tag_id_aggregation[-1],
              selected: @parsed_params_filters[:tag_id] && @parsed_params_filters[:tag_id].include?(-1)
            })
          end

          filter_options[:tag_id] = tag_id_filter_options.sort_by { |option| [-option[:count], option[:label]] }
        end

        # Veracity
        if @enable_filters.include?(:veracity_key)
          veracity_key_aggregation = aggregations.fetch("veracity_key", {})
          veracity_key_filter_options = Assessment::VERACITIES.map do |veracity_key|
            veracity_name = I18n.t("veracity.names.#{veracity_key}")

            {
              value: veracity_name.parameterize,
              label: veracity_name,
              count: veracity_key_aggregation.fetch(veracity_key, 0),
              selected: @parsed_params_filters[:veracity_key] && @parsed_params_filters[:veracity_key].include?(veracity_key.to_s)
            }
          end

          filter_options[:veracity_key] = veracity_key_filter_options
        end

        # Released year
        if @enable_filters.include?(:released_year)
          released_year_aggregation = aggregations.fetch("released_year", {})
          years = released_year_aggregation.keys

          released_year_filter_options = years.map do |year|
            {
              value: year,
              label: "Rok #{year}",
              count: released_year_aggregation[year],
              selected: @parsed_params_filters[:released_year] && @parsed_params_filters[:released_year].include?(year.to_i)
            }
          end

          filter_options[:released_year] = released_year_filter_options.sort_by { |option| -option[:value] }
        end
      end

      filter_options
    end
end
