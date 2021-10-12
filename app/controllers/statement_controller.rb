# frozen_string_literal: true

class StatementController < FrontendController
  def index
    @params = params
  end

  def show
    @statement = Statement.factual_and_published.find(params[:id])
  end

  def show_preview
    @statement = Statement.factual_and_published.find(params[:id])

    @font_size = 34
    @line_height = 1.45
    if @statement.content.length > 150
      @font_size = 31
    end
    if @statement.content.length > 250
      @font_size = 26
    end
    if @statement.content.length > 350
      @font_size = 22
      @line_height = 1.35
    end

    render(layout: "layouts/empty")
  end
end
