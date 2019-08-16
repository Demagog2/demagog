# frozen_string_literal: true

class SearchController < FrontendController
  def index
    @query = params[:q] || ""
    @type = params[:type]
    @type = nil unless ["articles", "speakers", "statements"].include?(@type)

    @articles = Article.query_search_published(@query)
    @speakers = Speaker.query_search(@query)
    @statements = Statement.query_search_published_factual(@query)

    unless @query.empty?
      SearchedQuery.create(
        query: @query,
        result_type: @type,
        result: {
          articles_count: @articles.total_count,
          speakers_count: @speakers.total_count,
          statements_count: @statements.total_count,
        },
        user_id: user_signed_in? ? current_user.id : nil
      )
    end

    @type_results = case @type
                    when "articles"
                      @articles
                    when "speakers"
                      @speakers
                    when "statements"
                      @statements
    end
  end
end
