# frozen_string_literal: true

class StatementController < FrontendController
  def show
    @statement = Statement.factual_and_published.find(params[:id])
  end

  def show_preview
    @statement = Statement.factual_and_published.find(params[:id])

    @font_size = 34
    if @statement.content.length > 150
      @font_size = 31
    end
    if @statement.content.length > 250
      @font_size = 26
    end

    render(layout: "layouts/empty")
  end
end
