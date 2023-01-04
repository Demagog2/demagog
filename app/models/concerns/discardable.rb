# frozen_string_literal: true

require "active_support/concern"

module Discardable
  extend ActiveSupport::Concern
  include Discard::Model

  included do
    class_attribute :discard_column
    self.discard_column = :deleted_at
  end

  class_methods do
    def discard(id)
      obj = find_by(id:)
      obj.discard
    end
  end
end
