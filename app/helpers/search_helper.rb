# frozen_string_literal: true

module SearchHelper
  RECORD_NAMES_HASH = {
    speakers: "politiků",
    articles: "výstupů",
    statements: "výroků"
  }

  def show_more_link(type, records_count)
    link_to("Zobrazit všech #{records_count} #{RECORD_NAMES_HASH[type]} #{"\u2192".encode("utf-8")}",
            search_path(q: params[:q], type: type),
            class: "more-link s-more")
  end

  def render_records(type, records)
    case type.to_s.to_sym
    when :speakers
      render_speakers(records)
    when :articles
      render_articles(records)
    when :statements
      render_statements(records)
    end
  end

  def render_speakers(record)
    render(partial: "speaker/listed", collection: record, as: :speaker, locals: { show_latest: false })
  end

  def render_articles(record)
    render(partial: "article/preview", collection: record, as: :article)
  end

  def render_statements(record)
    render(partial: "statement/detail", collection: record, as: :statement, locals: { wide_display: false })
  end
end
