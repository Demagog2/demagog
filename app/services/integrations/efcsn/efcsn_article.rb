# frozen_string_literal: true

module Integrations::Efcsn
  class EfcsnArticle
    include ActiveModel::Model

    attr_accessor :id, :created_at, :updated_at
  end
end
