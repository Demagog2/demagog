# frozen_string_literal: true

class ArticleController < ApplicationController
  def index
    # Redirect pages to new url
    page = Page.published.friendly.find_by(slug: params[:slug])
    if page
      return redirect_to page_url(page), status: 301
    end

    @article = Article.published.friendly.find(params[:slug])
    @article_type = @article.article_type.name == "default" ? "factcheck" : "editorial"

    @statements_filters = {}
    if @article_type == "factcheck"
      if params[:recnik]
        @statements_filters[:speaker_id] = params[:recnik].to_i
      end

      if params[:hodnoceni]
        @statements_filters[:veracity_key] = case params[:hodnoceni]
                                             when "pravda"
                                               :true
                                             when "nepravda"
                                               :untrue
                                             when "zavadejici"
                                               :misleading
                                             when "neoveritelne"
                                               :unverifiable
                                             else
                                               nil
        end
      end
    end

    p @statements_filters

    # return unless Rails.env.production?

    # TODO: revisit cache headers and do properly
    # expires_in 1.hour, public: true
    # if stale? @article, public: true
    #   respond_to do |format|
    #     format.html
    #   end
    # end
  end
end
