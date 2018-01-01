# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def speaker_stats
    Stats::Speaker::StatsBuilderFactory.new.create(Settings)
  end

  def source_stats
    Stats::Source::StatsBuilderFactory.new.create(Settings)
  end
end
