# frozen_string_literal: true

class StatementController < ApplicationController
  def show
    @statement = Statement.factual_and_published.find(params[:id])
  end
end
