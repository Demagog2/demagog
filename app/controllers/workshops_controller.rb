# frozen_string_literal: true

class WorkshopsController < ApplicationController
  def index
    @workshop_order = WorkshopOrder.new
    @workshops = Workshop.order(created_at: :asc)
  end

  def create
    @workshop = WorkshopOrder.new(params[:workshop_order])

    if @workshop.valid?
      redirect_to :workshop_index_path, notice: "Workshop ordered!"
    else
      render :new
    end
  end
end
