# frozen_string_literal: true

class StatementController < ApplicationController
  def show
    @statement = Statement.published_factual.find(params[:id])
  end
end
