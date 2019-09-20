# frozen_string_literal: true

module SlackNotifier
  class NoOpHTTPClient
    def self.post(uri, params = {})
      # bonus, you could log or observe posted params here
    end
  end

  ProofreadingNotifier = (Rails.env.production? && ENV["SLACK_PROOFREADING_NOTIFICATIONS_WEBHOOK"]) ?
    Slack::Notifier.new(ENV["SLACK_PROOFREADING_NOTIFICATIONS_WEBHOOK"]) :
    Slack::Notifier.new("WEBHOOK_URL") do
      http_client NoOpHTTPClient
    end
end
