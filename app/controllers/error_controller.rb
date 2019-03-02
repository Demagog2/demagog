# frozen_string_literal: true

class ErrorController < ApplicationController
  def internal_server_error
    respond_to do |format|
      format.html { render status: 500 }
      format.json { render json: { error: "Internal server error" }, status: 500 }
    end
  end

  def not_found
    respond_to do |format|
      format.html { render status: 404 }
      format.json { render json: { error: "Not found" }, status: 404 }
    end
  end

  def unprocessable_entity
    respond_to do |format|
      format.html { render status: 422 }
      format.json { render json: { error: "Invalid request params" }, status: 422 }
    end
  end
end
