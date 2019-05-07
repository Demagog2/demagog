# frozen_string_literal: true

require "nokogiri"

class PromisesController < ApplicationController
  def initialize
    super

    economy_area_tag = Tag.find_by(name: "Hospodářství", for_statement_type: "promise")
    environment_area_tag = Tag.find_by(name: "Životní prostředí", for_statement_type: "promise")
    welfare_area_tag = Tag.find_by(name: "Sociální stát", for_statement_type: "promise")
    education_area_tag = Tag.find_by(name: "Vzdělanost", for_statement_type: "promise")
    rule_of_law_area_tag = Tag.find_by(name: "Právní stát", for_statement_type: "promise")
    safety_area_tag = Tag.find_by(name: "Bezpečnost", for_statement_type: "promise")

    @area_tags = [
      economy_area_tag,
      environment_area_tag,
      welfare_area_tag,
      education_area_tag,
      rule_of_law_area_tag,
      safety_area_tag,
    ]

    @params_filter_keys = {
      area_tag: :oblast,
      promise_rating: :hodnoceni
    }

    @params_filter_values = {
      area_tag: {
        economy_area_tag.id => "hospodarstvi",
        environment_area_tag.id => "zivotni-prostredi",
        welfare_area_tag.id => "socialni-stat",
        education_area_tag.id => "vzdelanost",
        rule_of_law_area_tag.id => "pravni-stat",
        safety_area_tag.id => "bezpecnost"
      },
      promise_rating: {
        PromiseRating::FULFILLED => "splnene",
        PromiseRating::IN_PROGRESS => "prubezne-plnene",
        PromiseRating::PARTIALLY_FULFILLED => "castecne-splnene",
        PromiseRating::BROKEN => "porusene",
        PromiseRating::STALLED => "nerealizovane"
      }
    }

    @promises_definitions = {
      "sobotkova-vlada" => {
        get_statements: lambda {
          # Temporary solution for proper Czech sorting where e.g characters [a, á, b] you
          # want sorted that way, but in default sorting it is [a, b, á]. I am not using
          # database-level collation, because default "cs_CZ" is not working on macOS
          # (see https://github.com/PostgresApp/PostgresApp/issues/216)
          collation = ENV["DB_PER_COLUMN_COLLATION"] || "cs_CZ"

          Statement
            .where(source_id: [439, 440, 441, 442, 443, 444])
            .includes(:assessment, assessment: [:promise_rating, :assessment_methodology])
            .order(
              Arel.sql("title COLLATE \"#{collation}\" ASC")
            )
        },
        get_statement_source_url: lambda { |statement|
          sprintf("https://www.vlada.cz/assets/media-centrum/dulezite-dokumenty/programove_prohlaseni_unor_2014.pdf#page=%d", sobotkova_vlada_get_promise_source_page(statement))
        },
        get_statement_source_label: lambda { |statement|
          sprintf("Programové prohlášení vlády, únor 2014, str. %d", sobotkova_vlada_get_promise_source_page(statement))
        },
        intro_partial: "promises/sobotkova_vlada_intro",
        methodology_partial: "promises/sobotkova_vlada_methodology"
      },
      "druha-vlada-andreje-babise" => {
        get_statements: lambda {
          # Temporary solution for proper Czech sorting where e.g characters [a, á, b] you
          # want sorted that way, but in default sorting it is [a, b, á]. I am not using
          # database-level collation, because default "cs_CZ" is not working on macOS
          # (see https://github.com/PostgresApp/PostgresApp/issues/216)
          collation = ENV["DB_PER_COLUMN_COLLATION"] || "cs_CZ"

          Statement
            .where(source_id: [562])
            .where(assessments: {
              evaluation_status: Assessment::STATUS_APPROVED,
            })
            .includes(:assessment, assessment: :promise_rating)
            .order(
              Arel.sql("title COLLATE \"#{collation}\" ASC")
            )
        },
        get_statement_source_url: lambda { |statement|
          "https://www.vlada.cz/assets/jednani-vlady/programove-prohlaseni/Programove-prohlaseni-vlady-cerven-2018.pdf"
        },
        get_statement_source_label: lambda { |statement|
          "Programové prohlášení vlády, červen 2018"
        },
        intro_partial: "promises/druha_vlada_andreje_babise_intro",
        methodology_partial: "promises/druha_vlada_andreje_babise_methodology"
      }
    }
  end

  def index
    redirect_to "/sliby/#{@promises_definitions.keys.first}", status: 301
  end

  def overview
    definition = @promises_definitions.fetch(params[:slug], nil)
    raise ActionController::RoutingError.new("Not Found") if definition.nil?

    # Preview only for users signed in to admin. Remove when launching.
    raise ActionController::RoutingError.new("Not Found") if params[:slug] == "druha-vlada-andreje-babise" && !user_signed_in?

    @slug = params[:slug]
    @all = definition[:get_statements].call
    @get_statement_source_url = definition[:get_statement_source_url]
    @get_statement_source_label = definition[:get_statement_source_label]
    @intro_partial = definition[:intro_partial]

    @promise_rating_keys = @all.first.assessment.assessment_methodology.rating_keys
    @all_count = @all.count

    @promise_rating_counts = @promise_rating_keys.map { |key| [key, @all.where(assessments: { promise_ratings: { key: key } }).count] }.to_h
    @promise_rating_percents = @promise_rating_keys.map { |key| [key, ((@promise_rating_counts[key].to_f / @all_count.to_f) * 100).round] }.to_h

    filters = filters_from_params
    filtered_statements = @all.select do |statement|
      remains = true

      unless filters[:area_tag].empty? || filters[:area_tag].include?(statement.tags[0].id)
        remains = false
      end
      unless filters[:promise_rating].empty? || filters[:promise_rating].include?(statement.assessment.promise_rating.key)
        remains = false
      end

      remains
    end
    @filtered_statement_ids = filtered_statements.map { |statement| statement.id }

    @promises_list_rating_labels = {
      PromiseRating::FULFILLED => "Splněný slib",
      PromiseRating::IN_PROGRESS => "Průběžně plněný slib",
      PromiseRating::PARTIALLY_FULFILLED => "Část. splněný slib",
      PromiseRating::BROKEN => "Porušený slib",
      PromiseRating::STALLED => "Nerealizovaný slib"
    }
  end

  def methodology
    definition = @promises_definitions.fetch(params[:slug], nil)
    raise ActionController::RoutingError.new("Not Found") if definition.nil?

    @slug = params[:slug]
    @methodology_partial = definition[:methodology_partial]
  end

  # def document
  #   all_promises = get_promises

  #   @promises = all_promises.map do |promise|
  #     {
  #       id: promise.id,
  #       name: get_promise_name(promise),
  #       veracity_key: promise.assessment.veracity.key,
  #       explanation_html: promise.assessment.explanation_html,
  #       page: get_promise_document_page(promise),
  #       position: get_promise_position_in_document(promise)
  #     }
  #   end
  # end

  helper_method :to_lazy_loading_iframes_and_images
  def to_lazy_loading_iframes_and_images(explanation_html)
    fragment = Nokogiri::HTML.fragment(explanation_html)

    # We replace iframe src attributes with about:blank so iframes are not loaded
    # on the initial visit to the page. We do that to speed up the initial load.
    fragment.css("iframe").each do |node|
      node["data-src"] = node["src"]
      node["src"] = "about:blank"
    end

    # Similarly with images
    fragment.css("img").each do |node|
      node["data-src"] = node["src"]
      node["src"] = ""
    end

    HtmlBeautifier.beautify(fragment.to_html)
  end

  helper_method :filter_params_toggle_value
  def filter_params_toggle_value(type, value)
    filters = filters_from_params

    if filters[type].include?(value)
      filters[type].delete(value)
    else
      filters[type] << value
    end

    filters_to_params(filters)
  end

  helper_method :filter_params_clear
  def filter_params_clear(type)
    filters = filters_from_params
    filters[type] = []
    filters_to_params(filters)
  end

  helper_method :filter_params_have_value?
  def filter_params_have_value?(type, value)
    filters = filters_from_params
    filters[type].include?(value)
  end

  helper_method :filter_params_empty?
  def filter_params_empty?(type)
    filters = filters_from_params
    filters[type].empty?
  end

  helper_method :promise_permalink
  def promise_permalink(statement)
    filters = filters_from_params

    # clear all filters
    filters.transform_values! { |v| [] }

    permalink_params = filters_to_params(filters)
    permalink_params[:anchor] = "slib-#{statement.id}"

    url_for(permalink_params)
  end

  private

    # def get_promise_position_in_document(promise)
    #   position = {
    #     # hospodarstvi
    #     15076 => [141, 14, 159, 9, 54],
    #     15079 => [125, 7, 127, 29, 43],
    #     15074 => [174, 0, 197, 35, 68],
    #     15071 => [126, 0, 146, 18, 43],
    #     15077 => [258, 0, 291, 15, 80],
    #     15072 => [147, 0, 162, 33, 50],
    #     15073 => [165, 0, 171, 18, 59],
    #     15069 => [230, 0, 271, 4, 80],
    #     15070 => [40, 0, 47, 14, 15.5],
    #     15080 => [153, 0, 163, 6, 62.2],
    #     15211 => [232, 19, 241, 12, 79.5],
    #     15075 => [200, 0, 221, 36, 75],
    #   }.fetch(promise.id, nil)
    # end

    def sobotkova_vlada_get_promise_source_page(statement)
      {
        15038 => 5,
        15039 => 5,
        15040 => 5,
        15041 => 5,

        15043 => 5,
        15044 => 5,
        15045 => 6,
        15046 => 6,

        15048 => 25,
        15049 => 25,
        15050 => 26,
        15051 => 26,
        15052 => 11,
        15053 => 26,

        15055 => 11,
        15056 => 26,
        15057 => 27,
        15058 => 28,
        15059 => 28,

        15062 => 29,
        15063 => 29,
        15064 => 29,
        15065 => 29,
        15066 => 29,
        15067 => 29,
        15068 => 29,
        15069 => 29,
        15070 => 30,
        15071 => 30,
        15072 => 30,
        15073 => 30,
        15074 => 30,
        15075 => 30,
        15076 => 5,
        15077 => 8,

        15079 => 9,
        15080 => 14,
        15081 => 4,

        15083 => 48,
        15084 => 48,
        15085 => 48,
        15086 => 48,
        15087 => 49,
        15088 => 49,
        15089 => 49,
        15090 => 50,
        15091 => 50,
        15092 => 15,
        15093 => 16,
        15094 => 16,

        15096 => 18,
        15097 => 15,
        15098 => 18,
        15099 => 44,
        15100 => 44,
        15101 => 44,
        15102 => 44,
        15103 => 44,
        15104 => 13,

        15106 => 45,
        15107 => 45,
        15108 => 45,
        15109 => 45,
        15110 => 45,
        15111 => 45,
        15112 => 46,
        15113 => 46,
        15114 => 46,
        15115 => 46,
        15116 => 46,
        15117 => 46,
        15118 => 46,
        15119 => 46,

        15121 => 47,

        15123 => 47,
        15124 => 4,
        15125 => 15,
        15126 => 9,
        15127 => 40,
        15128 => 40,
        15129 => 40,
        15130 => 41,
        15131 => 41,
        15132 => 41,
        15133 => 42,
        15134 => 42,
        15135 => 42,
        15136 => 42,
        15137 => 42,

        15139 => 43,
        15140 => 43,
        15141 => 43,
        15142 => 12,
        15143 => 43,
        15144 => 43,
        15145 => 43,
        15146 => 43,
        15147 => 43,
        15148 => 43,
        15149 => 43,
        15150 => 44,
        15151 => 44,
        15152 => 10,
        15153 => 6,
        15154 => 36,
        15155 => 36,
        15156 => 36,
        15157 => 6,
        15158 => 6,
        15159 => 36,
        15160 => 14,
        15161 => 6,
        15162 => 7,
        15163 => 37,
        15164 => 37,
        15165 => 37,
        15166 => 37,
        15167 => 37,
        15168 => 37,
        15169 => 38,
        15170 => 7,
        15171 => 38,
        15172 => 39,

        15174 => 39,
        15175 => 39,
        15176 => 39,
        15177 => 40,
        15178 => 40,
        15179 => 31,
        15180 => 32,

        15182 => 32,

        15184 => 32,
        15185 => 32,
        15186 => 32,

        15188 => 32,
        15189 => 33,
        15190 => 8,
        15191 => 33,
        15192 => 8,
        15193 => 33,
        15194 => 12,
        15195 => 34,
        15196 => 8,
        15197 => 34,
        15198 => 34,
        15199 => 8,
        15200 => 35,
        15201 => 35,
        15202 => 35,

        15204 => 35,

        15206 => 35,
        15207 => 35,
        15208 => 14,
        15209 => 10,

        15211 => 25,

        15214 => 8
      }.fetch(statement.id, 0)
    end

    def filters_from_params
      filters = {}

      @params_filter_keys.each do |filter_type, params_key|
        params_values = params.fetch(params_key, [])
        params_values = [] unless params_values.kind_of?(Array)

        filter_values = []
        params_values.each do |params_value|
          if @params_filter_values[filter_type].value?(params_value)
            filter_values << @params_filter_values[filter_type].key(params_value)
          end
        end

        filters[filter_type] = filter_values.uniq
      end

      filters
    end

    def filters_to_params(filters)
      new_params = params.dup

      filters.each do |filter_type, filter_values|
        params_key = @params_filter_keys[filter_type]
        params_values = filter_values.map { |filter_value| @params_filter_values[filter_type][filter_value] }

        new_params = new_params.merge(params_key => params_values)
      end

      new_params
    end
end
