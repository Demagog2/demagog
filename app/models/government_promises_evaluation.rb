# frozen_string_literal: true

class GovernmentPromisesEvaluation
  include ActiveModel::Model

  attr_accessor :article

  delegate :id, :slug, :title, :perex, to: :article

  def promise_count
    @promise_count ||= promises.count
  end

  def promises
    Statement.promise_and_published
             .joins(source: { article_segments: :article })
             # .includes(assessment: :promise_rating)
             .where(articles: { id: article })
  end

  def stats
    stats = article.assessment_methodology.rating_keys.index_with(0)

    promises.each do |promise|
      stats[promise.assessment.promise_rating.key] += 1
    end

    stats.map do |(key, count)|
      { key:, count:, percentage: count > 0 ? (count.to_f / promise_count.to_f) * 100 : 0 }
    end
  end
end
