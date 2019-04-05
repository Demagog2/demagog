# frozen_string_literal: true

require "nokogiri"

class PromisesController < ApplicationController
  def index
    @economy = Statement.where(source_id: 439) # hospodarstvi
    @security = Statement.where(source_id: 440) # bezpecnost
    @rural = Statement.where(source_id: 441) # venkov
    @social = Statement.where(source_id: 442) # pece
    @education = Statement.where(source_id: 443) # vzdelanost
    @legal = Statement.where(source_id: 444) # pravni stat

    @speaker = Speaker.find(268) # Koalice 2014-2017
    @speaker.first_name = "Vláda"
    @speaker.last_name = "Bohuslava Sobotky"

    @all = get_promises

    @fulfilledKey = Veracity::TRUE
    @partiallyFulfilledKey = Veracity::MISLEADING
    @brokenKey = Veracity::UNTRUE

    @allCount = @all.count
    @fulfilledCount = @all.where(assessments: { veracities: { key: @fulfilledKey } }).count
    @partiallyFulfilledCount = @all.where(assessments: { veracities: { key: @partiallyFulfilledKey } }).count
    @brokenCount = @all.where(assessments: { veracities: { key: @brokenKey } }).count

    @fulfilledPercents = ((@fulfilledCount.to_f / @allCount.to_f) * 100).round
    @partiallyFulfilledPercents = ((@partiallyFulfilledCount.to_f / @allCount.to_f) * 100).round
    @brokenPercents = ((@brokenCount.to_f / @allCount.to_f) * 100).round

    @areaFilterItems = {
      "hospodarstvi" => 439,
      "venkov" => 441,
      "pece" => 442,
      "vzdelanost" => 443,
      "pravni-stat" => 444,
      "bezpecnost" => 440
    }
    @assessmentFilterItems = {
      "splnene" => :true,
      "castecne-splnene" => :misleading,
      "porusene" => :untrue
    }

    @filters = {
      veracity_key: nil,
      source_id: nil
    }
    if params[:hodnoceni]
      @filters[:veracity_key] = @assessmentFilterItems.fetch(params[:hodnoceni], nil)
    end
    if params[:oblast]
      @filters[:source_id] = @areaFilterItems.fetch(params[:oblast], nil)
    end

    # TODO: rebuild the url from filters & redirect if it is not the same

    @filtered = @all
    unless @filters[:veracity_key].nil?
      @filtered = @filtered.where(assessments: { veracities: { key: @filters[:veracity_key] } })
    end
    unless @filters[:source_id].nil?
      @filtered = @filtered.where(source_id: @filters[:source_id])
    end

    @filtered_ids = @filtered.map { |statement| statement.id }
  end

  def methodology
  end

  def document
    all_promises = get_promises

    @promises = all_promises.map do |promise|
      {
        id: promise.id,
        name: get_promise_name(promise),
        veracity_key: promise.assessment.veracity.key,
        explanation_html: promise.assessment.explanation_html,
        page: get_promise_document_page(promise),
        position: get_promise_position_in_document(promise)
      }
    end
  end

  helper_method :get_promise_name
  def get_promise_name(statement)
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

  helper_method :get_promise_content
  def get_promise_content(statement)
    statement.content.split("\n").drop(1).join("\n").strip
  end

  helper_method :get_promise_area
  def get_promise_area(statement)
    case statement.source_id
    when 439 then "economy"
    when 440 then "security"
    when 441 then "rural"
    when 442 then "social"
    when 443 then "education"
    when 444 then "legal"
    end
  end

  helper_method :get_promise_area_label
  def get_promise_area_label(statement)
    case statement.source_id
    when 439 then "Hospodářství"
    when 440 then "Bezpečnost"
    when 441 then "Venkov"
    when 442 then "Péče"
    when 443 then "Vzdělanost"
    when 444 then "Právní stát"
    end
  end

  helper_method :get_promise_explanation_html
  def get_promise_explanation_html(statement)
    fragment = Nokogiri::HTML.fragment(statement.assessment.explanation_html)

    # We replace iframe src attributes with about:blank so iframes are not loaded
    # on the initial visit to the page. We do that to speed up the initial load.
    fragment.css("iframe").each do |node|
      node["data-src"] = node["src"]
      node["src"] = "about:blank"
    end

    HtmlBeautifier.beautify(fragment.to_html)
  end

  helper_method :get_promise_document_page
  def get_promise_document_page(promise)
    {
      15076 => 5,
      15079 => 9,
      15074 => 30,
      15071 => 30,
      15077 => 8,
      15072 => 30,
      15073 => 30,
      15069 => 29,
      15070 => 30,
      15080 => 14,
      15211 => 25,
      15075 => 30,
    }.fetch(promise.id, nil)
  end

  private

    def get_promises
      show_ids = [
        # hospodarstvi
        15076, 15079, 15074, 15071, 15077, 15072, 15073, 15069, 15070, 15080, 15211, 15075,
        # venkov
        15206, 15202, 15207, 15199, 15204, 15201, 15200, 15198, 15214,
        # pece
        15170, 15171, 15178, 15169, 15177, 15172, 15174, 15175, 15176,
        # vzdelanost
        15146, 15209, 15152, 15151, 15147, 15145, 15150, 15148, 15149,
        # pravni stat
        15124, 15121, 15123, 15208, 15125, 15119,
        # bezpecnost
        15098, 15094, 15093, 15097, 15096
      ]
      # show_ids = show_ids.concat(@economy.limit(12).map { |s| s.id })
      # show_ids = show_ids.concat(@security.limit(5).map { |s| s.id })
      # show_ids = show_ids.concat(@rural.limit(9).map { |s| s.id })
      # show_ids = show_ids.concat(@social.limit(9).map { |s| s.id })
      # show_ids = show_ids.concat(@education.limit(9).map { |s| s.id })
      # show_ids = show_ids.concat(@legal.limit(6).map { |s| s.id })

      # Temporary solution for proper Czech sorting where e.g characters [a, á, b] you
      # want sorted that way, but in default sorting it is [a, b, á]. I am not using
      # database-level collation, because default "cs_CZ" is not working on macOS
      # (see https://github.com/PostgresApp/PostgresApp/issues/216)
      collation = ENV["DB_PER_COLUMN_COLLATION"] || "cs_CZ"

      Statement
        .where(id: show_ids)
        .where(source_id: [439, 440, 441, 442, 443, 444])
        .includes(:assessment, assessment: :veracity)
        .order(
          Arel.sql("content COLLATE \"#{collation}\" ASC")
        )
    end

    def get_promise_position_in_document(promise)
      position = {
        # hospodarstvi
        15076 => [141, 14, 159, 9, 54],
        15079 => [125, 7, 127, 29, 43],
        15074 => [174, 0, 197, 35, 68],
        15071 => [126, 0, 146, 18, 43],
        15077 => [258, 0, 291, 15, 80],
        15072 => [147, 0, 162, 33, 50],
        15073 => [165, 0, 171, 18, 59],
        15069 => [230, 0, 271, 4, 80],
        15070 => [40, 0, 47, 14, 15.5],
        15080 => [153, 0, 163, 6, 62.2],
        15211 => [232, 19, 241, 12, 79.5],
        15075 => [200, 0, 221, 36, 75],
      }.fetch(promise.id, nil)
    end
end
