# frozen_string_literal: true

full_host = "http://localhost:3000"
if Rails.env.production?
  full_host = "https://demagog.cz"
end
if Rails.env.staging?
  full_host = "https://demagog-cz-staging.herokuapp.com/"
end

OmniAuth.config.full_host = full_host
