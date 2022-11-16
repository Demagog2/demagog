# frozen_string_literal: true

class ArchiveController < ApplicationController
  def index
    @articles = Article
      .where(published: true)
      .order(published_at: :desc)
      .page(params[:page])
  end
end
