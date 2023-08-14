# frozen_string_literal: true

class ArticlePresenter
  attr_accessor :factcheck_source_speakers

  def initialize(article)
    @article = article

    @factcheck_source_speakers = init_factcheck_source_speakers()
  end

  def show_factcheck_video
    @article.article_type_default? && !@article.source.nil? && !@article.source.video_type.nil? && !@article.source.video_id.nil?
  end

  def factcheck_video_record_name
    @article.source.video_type === "audio" ? "audiozáznam" : "videozáznam"
  end

  def init_factcheck_source_speakers
    return [] unless @article.article_type_default?

    source_speakers = @article
      .source
                        &.source_speakers
                        &.order(last_name: :asc, first_name: :asc)
                        &.includes(
                          :body,
                          :speaker
                        ) || []

    # Only source speakers with published statements
    source_speakers = source_speakers.select do |source_speaker|
      source_speaker.statements.factual_and_published.length > 0
    end

    source_speakers
  end

  def factcheck_source_speaker_stats(source_speaker)
    default_stats = {
      Veracity::TRUE => 0,
      Veracity::UNTRUE => 0,
      Veracity::MISLEADING => 0,
      Veracity::UNVERIFIABLE => 0,
    }

    article_stat_records = ArticleStat.where(article_id: @article.id, speaker_id: source_speaker.speaker_id)

    stats = article_stat_records.reduce(default_stats) do |carry, article_stat|
      carry[article_stat.key] = article_stat.count
      carry
    end

    stats.symbolize_keys
  end
end
