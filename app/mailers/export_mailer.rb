# frozen_string_literal: true

class ExportMailer < ApplicationMailer
  default from: "Administrace Demagog.cz <noreply@demagog.cz>"

  def export_email
    export = params[:export]
    send_to_email = params[:send_to_email]

    if export == "factual_statements"
      xlsx = ApplicationController.render(
        layout: false,
        handlers: [:axlsx],
        formats: [:xlsx],
        template: "admin/export/factual_statements",
        locals: {
          :@statements => Statement.factual_and_published.includes(:speaker, :assessment, :tags, :source, assessment: [:veracity], source: [:medium, :media_personalities])
        }
      )
      attachment = Base64.encode64(xlsx)
      attachments["Výroky Demagog.cz.xlsx"] = { mime_type: Mime[:xlsx], content: attachment, encoding: "base64" }
    else
      raise Exception.new("Export #{export} not implemented in ExportMailer")
    end

    mail(to: send_to_email, subject: "Export")
  end
end
