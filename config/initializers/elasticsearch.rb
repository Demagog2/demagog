# frozen_string_literal: true

config = {
  host: "http://localhost:9200/",
  transport_options: {
    request: { timeout: 5 }
  }
}

config_file = Rails.root.join("config", "elasticsearch.yml")

if config_file.exist?
  config.merge!(YAML.unsafe_load(ERB.new(config_file.read).result)[Rails.env].symbolize_keys)
end

Elasticsearch::Model.client = Elasticsearch::Client.new(config)
