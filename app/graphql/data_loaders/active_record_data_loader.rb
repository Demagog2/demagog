# frozen_string_literal: true

module DataLoaders
  class ActiveRecordDataLoader < GraphQL::Dataloader::Source
    def initialize(model_class)
      @model_class = model_class
    end

    def fetch(ids)
      indexed_by_id = @model_class.where(id: ids).index_by(&:id)

      ids.map do |id|
        indexed_by_id[id]
      end
    end
  end
end
