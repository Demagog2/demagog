# frozen_string_literal: true

require "nokogiri"

class PromisesController < FrontendController
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
        PromiseRating::IN_PROGRESS => "rozpracovane",
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
            .where(published: true)
            .includes(:assessment, assessment: [:promise_rating, :assessment_methodology])
            .order(
              Arel.sql("title COLLATE \"#{collation}\" ASC")
            )
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
            .where(published: true)
            .where(assessments: {
              evaluation_status: Assessment::STATUS_APPROVED,
            })
            .includes(:assessment, assessment: :promise_rating)
            .order(
              Arel.sql("title COLLATE \"#{collation}\" ASC")
            )
        },
        intro_partial: "promises/druha_vlada_andreje_babise_intro",
        methodology_partial: "promises/druha_vlada_andreje_babise_methodology"
      },
      "100-dni-prezidenta-petra-pavla" => {
        get_statements: lambda {
          # Temporary solution for proper Czech sorting where e.g characters [a, á, b] you
          # want sorted that way, but in default sorting it is [a, b, á]. I am not using
          # database-level collation, because default "cs_CZ" is not working on macOS
          # (see https://github.com/PostgresApp/PostgresApp/issues/216) 1052
          collation = ENV["DB_PER_COLUMN_COLLATION"] || "cs_CZ"

          Statement
            .where(source_id: [1052])
            .where(published: true)
            .where(assessments: {
              evaluation_status: Assessment::STATUS_APPROVED,
            })
            .includes(:assessment, assessment: :promise_rating)
            .order(
              Arel.sql("title COLLATE \"#{collation}\" ASC")
            )
        },
        intro_partial: "promises/100_dni_prezidenta_petra_pavla_intro",
        methodology_partial: "promises/druha_vlada_andreje_babise_methodology"
      },
      "sliby-vlady-petra-fialy" => {
        get_statements: lambda {
          # Temporary solution for proper Czech sorting where e.g characters [a, á, b] you
          # want sorted that way, but in default sorting it is [a, b, á]. I am not using
          # database-level collation, because default "cs_CZ" is not working on macOS
          # (see https://github.com/PostgresApp/PostgresApp/issues/216) 1052
          # .where(source_id: [1048])
          collation = ENV["DB_PER_COLUMN_COLLATION"] || "cs_CZ"

          Statement
            .where(source_id: [1048])
            .where(published: true)
            .where(assessments: {
              evaluation_status: Assessment::STATUS_APPROVED,
            })
            .includes(:assessment, assessment: :promise_rating)
            .order(
              Arel.sql("title COLLATE \"#{collation}\" ASC")
            )
        },
        intro_partial: "promises/sliby_vlady_petra_fialy_intro",
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

    ENV["DB_PER_COLUMN_COLLATION"]

    @slug = params[:slug]
    @all = definition[:get_statements].call
    @intro_partial = definition[:intro_partial]

    @promise_rating_keys = @all.first.assessment.assessment_methodology.rating_keys
    @all_count = @all.count

    @promise_rating_counts = @promise_rating_keys.index_with { |key| @all.where(assessments: { promise_ratings: { key: } }).count }
    @promise_rating_percents = @promise_rating_keys.index_with { |key| ((@promise_rating_counts[key].to_f / @all_count.to_f) * 100).round }

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
      PromiseRating::FULFILLED => "Splněný",
      PromiseRating::IN_PROGRESS => "Rozpracovaný",
      PromiseRating::PARTIALLY_FULFILLED => "Část. splněný",
      PromiseRating::BROKEN => "Porušený",
      PromiseRating::STALLED => "Nerealizovaný",
      PromiseRating::NOT_YET_EVALUATED => "Zatím nehodnocený"
    }

    @promises_list_rating_classes = {
      PromiseRating::FULFILLED => "primary",
      PromiseRating::IN_PROGRESS => "primary-light",
      PromiseRating::PARTIALLY_FULFILLED => "secondary",
      PromiseRating::BROKEN => "red",
      PromiseRating::STALLED => "gray",
      PromiseRating::NOT_YET_EVALUATED => "dark"
    }
  end

  def methodology
    definition = @promises_definitions.fetch(params[:slug], nil)
    raise ActionController::RoutingError.new("Not Found") if definition.nil? || params[:slug] != "sobotkova-vlada"

    @slug = params[:slug]
    @methodology_partial = definition[:methodology_partial]
  end

  def promise_embed
    definition = @promises_definitions.fetch(params[:slug], nil)
    raise ActionController::RoutingError.new("Not Found") if definition.nil? || params[:slug] != "druha-vlada-andreje-babise"

    @display = params[:display] == "short" ? "short" : "full"
    @logo = params[:logo] == "hide" ? "hide" : "show"

    @promises_list_rating_labels = {
      PromiseRating::FULFILLED => "Splněný slib",
      PromiseRating::IN_PROGRESS => "Rozpracovaný slib",
      PromiseRating::PARTIALLY_FULFILLED => "Část. splněný slib",
      PromiseRating::BROKEN => "Porušený slib",
      PromiseRating::STALLED => "Nerealizovaný slib",
      PromiseRating::NOT_YET_EVALUATED => "Zatím nehodnocený slib"
    }

    statements = definition[:get_statements].call
    @statement = statements.where(id: params[:promise_id]).first
    raise ActionController::RoutingError.new("Not Found") if @statement.nil?

    response.headers["X-FRAME-OPTIONS"] = "ALLOWALL"
    render(layout: "layouts/embed")
  end

  def document
    definition = @promises_definitions.fetch(params[:slug], nil)
    raise ActionController::RoutingError.new("Not Found") if definition.nil? || params[:slug] != "druha-vlada-andreje-babise"

    statements = definition[:get_statements].call
    pages_by_id = statements.to_h { |s| [s.id, druha_vlada_andreje_babise_get_promise_source_page(s)] }

    statements_data = statements.map do |statement|
      {
        id: statement.id,
        title: statement.title,
        page: pages_by_id[statement.id] + 4,
        position: druha_vlada_andreje_babise_get_promise_document_position(statement),
        promise_rating_key: statement.assessment.promise_rating.key,
        short_explanation: statement.assessment.short_explanation,
        permalink: promise_permalink(statement)
      }
    end

    @statements_data = statements_data.sort_by { |s| s[:page] * 10000 + s[:position][0] }

    render(layout: "layouts/empty")
  end

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
    url_for(controller: "promises", action: "overview", anchor: "slib-#{statement.id}")
  end

  private
    def druha_vlada_andreje_babise_get_promise_document_position(statement)
      {
        17518 => [22, 0, 22, 71], # privatizace
        17565 => [1, 0, 2, 36], # odpolitizovani statni spravy
        17516 => [27, 43, 28, 6], # nebudeme zvysovat danovou zatez
        17517 => [29, 0, 30, 39], # superhruba mzda
        17519 => [7, 0, 11, 20], # dane nadnarodnich korporaci
        17520 => [43, 0, 45, 35], # zvyseni duchodu
        17523 => [39, 14, 43, 57], # socialni davky
        17521 => [9, 0, 9, 43], # zvyseni rodicovskeho prispevku
        17522 => [50, 0, 54, 53], # prvni tri nemocenske
        17525 => [26, 0, 27, 56], # digitalni cesko
        17524 => [49, 42, 52, 76], # analyza it dopadu
        17526 => [68, 46, 69, 50], # online platby u statnich instituci
        17527 => [6, 0, 8, 18], # penize do skolstvi
        17529 => [36, 0, 38, 24], # narok na skolku od 2 let
        17528 => [54, 23, 54, 63], # snizime pocet oboru stredniho vzdelavani
        17530 => [12, 0, 15, 19], # nove dalnice
        17531 => [1, 0, 2, 59], # elektronicky dalnicni kupon
        17532 => [29, 0, 35, 62], # vlakova doprava
        17533 => [33, 0, 34, 49], # navysime rozpocet na obranu
        17852 => [52, 23, 52, 62], # zakon o vojenskem zpravodajstvi
        17534 => [1, 0, 6, 50], # nabor vojaku
        17535 => [17, 0, 23, 23], # ucast na vojenskych misich
        17536 => [15, 0, 27, 25], # tvorba zakonu
        17537 => [52, 0, 53, 70], # vyber soudcu
        17540 => [1, 11, 3, 44], # ochrana dluzniku
        17538 => [11, 0, 17, 16], # celostatni referendum
        17539 => [22, 56, 27, 9], # whisteblowing, lobbing
        17563 => [39, 0, 41, 32], # posileni zastoupeni v eu
        17549 => [52, 55, 54, 12], # ochrana verejnopravnich medii
        17541 => [17, 0, 19, 14], # otevrena data ministerstva zdravotnictvi
        17542 => [49, 30, 52, 30], # elektronicky recept
        17543 => [13, 0, 14, 34], # podporime prevenci a zdravy zivotni styl
        17544 => [29, 37, 32, 13], # zdroje elektriny
        17545 => [1, 69, 4, 9], # poplatky za tezbu
        17546 => [11, 26, 13, 17], # pravo na internet
        17561 => [42, 0, 46, 14], # investicni plan zeme
        17562 => [55, 21, 56, 60], # rekodifikace stavebniho prava
        17548 => [3, 39, 7, 20], # mensi verejne zakazky
        17550 => [12, 43, 18, 15], # bytova vystavba
        17547 => [21, 0, 28, 60], # zakon o socialnim bydleni
        17551 => [53, 0, 58, 44], # ochrana turistu
        17552 => [55, 0, 55, 66], # podpora zemedelcu
        17553 => [14, 48, 17, 28], # strategie nakladani s vodou
        17554 => [32, 0, 34, 12], # ochrana zemedelske pudy
        17558 => [27, 42, 30, 23], # novy zakon o odpadech
        17555 => [34, 27, 36, 52], # regulator obchodu s vodou
        17556 => [36, 53, 39, 29], # zestatnovani vodohospodarskeho majetku
        17557 => [13, 0, 14, 61], # kotlikove dotace
        17559 => [7, 0, 8, 55], # financovani sportu
        17560 => [9, 0, 12, 6], # financovani sportu ii.
      }.fetch(statement.id, nil)
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
