# frozen_string_literal: true

module Schema::Articles::Types
  class SingleStatementArticleType < BaseArticleType
    field :statement, Types::StatementType, null: true

    def statement
      dataloader
        .with(Schema::Articles::DataLoaders::Statement)
        .load(object.id)
    end
  end
end
