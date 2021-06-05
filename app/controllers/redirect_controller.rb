# frozen_string_literal: true

class RedirectController < FrontendController
  def index
    article = Article.kept.published.friendly.find_by(slug: params[:slug])
    return redirect_to article_url(article), status: 301 if article

    page = Page.published.friendly.find_by(slug: params[:slug])
    return redirect_to page_url(page), status: 301 if page

    raise ActionController::RoutingError.new("Nothing found for url #{request.path}")
  end
end
