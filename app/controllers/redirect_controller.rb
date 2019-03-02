# frozen_string_literal: true

class RedirectController < ApplicationController
  def index
    article = Article.published.friendly.find_by(slug: params[:slug])
    if article
      return redirect_to article_url(article), status: 301
    end

    page = Page.published.friendly.find_by(slug: params[:slug])
    if page
      return redirect_to page_url(page), status: 301
    end

    raise ActionController::RoutingError.new("Nothing found for url #{request.path}")
  end
end
