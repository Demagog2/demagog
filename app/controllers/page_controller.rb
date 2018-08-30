# frozen_string_literal: true

class PageController < ApplicationController
  def show
    @page = Page.published.friendly.find(params[:slug])
    @users = User.where(active: true, user_public: true).order(rank: :asc, last_name: :asc) if params[:slug] == "o-nas"
  end
end
