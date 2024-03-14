# frozen_string_literal: true

module Schema::Articles::Types
  class GovernmentPromiseType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: true
    field :content, String, null: false
    field :source, GovernmentPromiseSourceType, null: false
    field :promise_rating, Types::PromiseRatingType, null: false
    field :short_explanation, String, null: true
    field :explanation_html, String, null: true
    field :area, Types::TagType, null: true

    def source
      { url: object.promise_source_url, label: object.promise_source_label }
    end

    def promise_rating
      dataloader
        .with(Schema::Articles::DataLoaders::PromiseRating, Assessment::STATUS_APPROVED)
        .load(object.id)
    end

    def area
      dataloader
        .with(Schema::Articles::DataLoaders::Tag)
        .load(object.id)
    end

    def short_explanation
      dataloader.with(Schema::Articles::DataLoaders::Explanation, Assessment::STATUS_APPROVED)
        .load(object.id)
        .short_explanation
    end

    def explanation_html
      dataloader.with(Schema::Articles::DataLoaders::Explanation, Assessment::STATUS_APPROVED)
        .load(object.id)
        .explanation_html
    end
  end
end
