# frozen_string_literal: true

require "nokogiri"

class PromisesController < ApplicationController
  def initialize
    super

    @evaluation_keys = {
      fulfilled: Veracity::TRUE,
      partially_fulfilled: Veracity::MISLEADING,
      broken: Veracity::UNTRUE,
      stalled: Veracity::UNVERIFIABLE
    }

    @areas = [
      { id: "hospodarstvi", label: "Hospodářství" },
      { id: "zivotni-prostredi", label: "Životní prostředí" },
      { id: "socialni-stat", label: "Sociální stát" },
      { id: "vzdelanost", label: "Vzdělanost" },
      { id: "pravni-stat", label: "Právní stát" },
      { id: "bezpecnost", label: "Bezpečnost" }
    ]
    @areas_by_id = Hash[@areas.map { |area| [area[:id], area] }]

    @params_filter_keys = {
      area: :oblast,
      evaluation: :hodnoceni
    }

    @params_filter_values = {
      area: {
        "hospodarstvi" => "hospodarstvi",
        "zivotni-prostredi" => "zivotni-prostredi",
        "socialni-stat" => "socialni-stat",
        "vzdelanost" => "vzdelanost",
        "pravni-stat" => "pravni-stat",
        "bezpecnost" => "bezpecnost"
      },
      evaluation: {
        fulfilled: "splnene",
        partially_fulfilled: "castecne-splnene",
        broken: "porusene",
        stalled: "nerealizovane"
      }
    }

    @promises_definitions = {
      "sobotkova-vlada" => {
        get_promises: lambda {
          # Temporary solution for proper Czech sorting where e.g characters [a, á, b] you
          # want sorted that way, but in default sorting it is [a, b, á]. I am not using
          # database-level collation, because default "cs_CZ" is not working on macOS
          # (see https://github.com/PostgresApp/PostgresApp/issues/216)
          collation = ENV["DB_PER_COLUMN_COLLATION"] || "cs_CZ"

          Statement
            .where(source_id: [439, 440, 441, 442, 443, 444])
            .includes(:assessment, assessment: :veracity)
            .order(
              Arel.sql("content COLLATE \"#{collation}\" ASC")
            )
        },
        to_promises_list: lambda { |promises|
          promises.map do |promise|
            {
              id: promise.id,
              name: sobotkova_vlada_get_promise_name(promise),
              area: @areas_by_id[sobotkova_vlada_get_promise_area_id(promise)],
              evaluation: @evaluation_keys.key(promise.assessment.veracity.key),
              content: sobotkova_vlada_get_promise_content(promise),
              source_url: sprintf("https://www.vlada.cz/assets/media-centrum/dulezite-dokumenty/programove_prohlaseni_unor_2014.pdf#page=%d", sobotkova_vlada_get_promise_source_page(promise)),
              source_label: sprintf("Programové prohlášení vlády, únor 2014, str. %d", sobotkova_vlada_get_promise_source_page(promise)),
              explanation_html: promise.assessment.explanation_html
            }
          end
        },
        intro_partial: "promises/sobotkova_vlada_intro",
        methodology_partial: "promises/sobotkova_vlada_methodology",
        evaluations: [:fulfilled, :partially_fulfilled, :broken]
      }
    }
  end

  def index
    redirect_to "/sliby/#{@promises_definitions.keys.first}", status: 301
  end

  def overview
    definition = @promises_definitions.fetch(params[:slug], nil)
    return head :not_found if definition.nil?

    @slug = params[:slug]
    @all = definition[:get_promises].call
    @intro_partial = definition[:intro_partial]
    @evaluations = definition[:evaluations]

    @all_count = @all.count

    to_partial_count = lambda { |key| @all.where(assessments: { veracities: { key: key } }).count }
    @partial_counts = {
      fulfilled: to_partial_count.call(@evaluation_keys[:fulfilled]),
      partially_fulfilled: to_partial_count.call(@evaluation_keys[:partially_fulfilled]),
      broken: to_partial_count.call(@evaluation_keys[:broken]),
      stalled: to_partial_count.call(@evaluation_keys[:stalled])
    }

    to_partial_percents = lambda { |partial_count| ((partial_count.to_f / @all_count.to_f) * 100).round }
    @partial_percents = {
      fulfilled: to_partial_percents.call(@partial_counts[:fulfilled]),
      partially_fulfilled: to_partial_percents.call(@partial_counts[:partially_fulfilled]),
      broken: to_partial_percents.call(@partial_counts[:broken]),
      stalled: to_partial_percents.call(@partial_counts[:stalled]),
    }

    @promises_list = definition[:to_promises_list].call(@all)

    filters = filters_from_params
    filtered_promises_list = @promises_list.select do |promise|
      remains = true

      unless filters[:area].empty? || filters[:area].include?(promise[:area][:id])
        remains = false
      end
      unless filters[:evaluation].empty? || filters[:evaluation].include?(promise[:evaluation])
        remains = false
      end

      remains
    end
    @filtered_promises_ids = filtered_promises_list.map { |promise| promise[:id] }

    @promises_list_evaluation_labels = {
      fulfilled: "Splněný slib",
      partially_fulfilled: "Část. splněný slib",
      broken: "Porušený slib"
    }
  end

  def methodology
    definition = @promises_definitions.fetch(params[:slug], nil)
    return head :not_found if definition.nil?

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

    def sobotkova_vlada_get_promise_name(statement)
      explicit_transform = {
        15046 => "Online sázení podle EU",
        15048 => "Peníze pro SFDI",
        15052 => "Dokončení úseků TEN-T",
        15062 => "Paušály pro OSVČ",
        15064 => "Snížení DPH na vybrané komodity",
        15071 => "EET",
        15075 => "Zkrácení daňových výhod pro některé OSVČ",
        15091 => "Nová tvorba rozpočtu MO",
        15092 => "Vzdušný prostor ČR",
        15116 => "Rozšíření pravomocí NKÚ",
        15204 => "Prostředky na živ. prostředí z EU",
        15154 => "Zrušení II. pilíře"
      }
      explicit_transform.key?(statement.id) ? explicit_transform[statement.id] : statement.content.split("\n")[0].capitalize
    end

    def sobotkova_vlada_get_promise_area_id(statement)
      case statement.source_id
      when 439 then "hospodarstvi"
      when 440 then "bezpecnost"
      when 441 then "zivotni-prostredi"
      when 442 then "socialni-stat"
      when 443 then "vzdelanost"
      when 444 then "pravni-stat"
      end
    end

    def sobotkova_vlada_get_promise_content(statement)
      statement.content.split("\n").drop(1).join("\n").strip
    end

    def sobotkova_vlada_get_promise_source_page(promise)
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
        15136 => 10,
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
      }.fetch(promise.id, 0)
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
