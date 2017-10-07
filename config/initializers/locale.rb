# frozen_string_literal: true

# Where the I18n library should search for translation files
# I18n.load_path += Dir[Rails.root.join('lib', 'locale', '*.{rb,yml}')]

# Whitelist locales available for the application
I18n.available_locales = [:en, :cs]

# Set default locale to czech
I18n.default_locale = :cs
