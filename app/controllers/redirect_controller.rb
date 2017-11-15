# frozen_string_literal: true

class RedirectController < ApplicationController
  def index
    article = Article.friendly.find(params[:slug])

    redirect_to article_url(article), status: 301
  end
end
