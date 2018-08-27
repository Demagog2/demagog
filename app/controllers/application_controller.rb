# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def menu_items
    MenuItem.order(order: :asc)
  end

  def speaker_stats
    Stats::Speaker::StatsBuilderFactory.new.create(Settings)
  end

  def article_stats
    Stats::Article::StatsBuilderFactory.new.create(Settings)
  end

  protected
    def after_sign_in_path_for(resource)
      request.env["omniauth.origin"] || stored_location_for(resource) || admin_path
    end

    def after_sign_out_path_for(resource)
      admin_path
    end
end
