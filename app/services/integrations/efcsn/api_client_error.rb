# frozen_string_literal: true

module Integrations::Efcsn
  class ApiClientError < Exception
    def initialize(msg, status, response_body)
      super("#{msg} #{status} #{response_body}")
    end
  end
end
