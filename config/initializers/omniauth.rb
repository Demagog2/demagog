# frozen_string_literal: true

OmniAuth.config.full_host = Rails.env.production? ? "https://demagog.cz" : "http://localhost:3000"
