# frozen_string_literal: true

require "tempfile"

class MailExportWorker
  include Sidekiq::Worker

  def perform(export, send_to_email)
    ExportMailer.with(export: export, send_to_email: send_to_email).export_email.deliver_now
  end
end
