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

    show_ids = []
    show_ids = show_ids.concat(@economy.limit(12).map { |s| s.id })
    show_ids = show_ids.concat(@security.limit(5).map { |s| s.id })
    show_ids = show_ids.concat(@rural.limit(9).map { |s| s.id })
    show_ids = show_ids.concat(@social.limit(9).map { |s| s.id })
    show_ids = show_ids.concat(@education.limit(9).map { |s| s.id })
    show_ids = show_ids.concat(@legal.limit(6).map { |s| s.id })

    @speaker = Speaker.find(268) # Koalice 2014-2017
    @speaker.first_name = "Vláda"
    @speaker.last_name = "Bohuslava Sobotky"

    # Temporary solution for proper Czech sorting where e.g characters [a, á, b] you
    # want sorted that way, but in default sorting it is [a, b, á]. I am not using
    # database-level collation, because default "cs_CZ" is not working on macOS
    # (see https://github.com/PostgresApp/PostgresApp/issues/216)
    collation = ENV["DB_PER_COLUMN_COLLATION"] || "cs_CZ"

    @all = Statement
      .where(id: show_ids)
      .where(source_id: [439, 440, 441, 442, 443, 444])
      .includes(:assessment, assessment: :veracity)
      .order(
        Arel.sql("important DESC"),
        Arel.sql("content COLLATE \"#{collation}\" ASC")
      )

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
end
