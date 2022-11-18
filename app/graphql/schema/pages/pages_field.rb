# frozen_string_literal: true

module Schema::Pages::PagesField
  extend ActiveSupport::Concern

  included do
    field :pages, [Types::PageType], null: false do
      argument :offset, GraphQL::Types::Int, default_value: 0, required: false
      argument :limit, GraphQL::Types::Int, default_value: 10, required: false
      argument :title, GraphQL::Types::String, required: false
      argument :include_unpublished, GraphQL::Types::Boolean, default_value: false, required: false
    end

    def pages(args)
      if args[:include_unpublished]
        # Public cannot access unpublished pages
        raise Errors::AuthenticationNeededError.new unless context[:current_user]

        pages = Page.kept
      else
        pages = Page.kept.published
      end

      pages = pages.offset(args[:offset]).limit(args[:limit]).order(title: :asc)

      pages = pages.matching_title(args[:title]) if args[:title].present?

      pages
    end
  end
end
