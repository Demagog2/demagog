# frozen_string_literal: true

class Schema::Articles::DataLoaders::Tag < GraphQL::Dataloader::Source
  def fetch(statement_ids)
    tags = Tag.all.index_by(&:id)

    index = StatementTag.where(statement_id: statement_ids)
        .pluck(:statement_id, :tag_id)
        .to_h

    statement_ids.map do |statement_id|
      tags[index[statement_id]]
    end
  end
end
