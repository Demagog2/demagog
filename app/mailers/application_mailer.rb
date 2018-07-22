# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: "noreply@demagog.cz"
  layout "mailer"
end
