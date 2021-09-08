# config/initializers/omniauth.rb

OmniAuth.config.full_host = Rails.env.production? ? 'https://demagog.cz' : 'http://localhost:3000'

OmniAuth.config.allowed_request_methods = %i[get]
