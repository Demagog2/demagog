# frozen_string_literal: true

class ElasticsearchWorker
  include Sidekiq::Worker

  def perform(model_name, operation, record_id)
    model = model_class[model_name.to_s.to_sym]

    case operation.to_s.to_sym
    when :index
      record = model.find_by_id(record_id)
      record.__elasticsearch__.index_document unless record.nil?
    when :update
      record = model.find_by_id(record_id)
      record.__elasticsearch__.update_document unless record.nil?
    when :destroy
      Elasticsearch::Model.client.delete index: model.index_name, type: model.document_type, id: record_id
    end
  end

  def model_class
    {
      article: Article,
      speaker: Speaker,
      statement: Statement
    }
  end
end
