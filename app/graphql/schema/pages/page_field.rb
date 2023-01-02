# frozen_string_literal: true

module Schema::Pages::PageField
  extend ActiveSupport::Concern

  included do
    field :page, Types::PageType, null: false do
      argument :id, GraphQL::Types::ID, required: false
      argument :slug, GraphQL::Types::String, required: false
      argument :include_unpublished, GraphQL::Types::Boolean, default_value: false, required: false
    end

    def page(args)
      if args[:include_unpublished]
        # Public cannot access unpublished pages
        raise Errors::AuthenticationNeededError.new unless context[:current_user]

        return Page.friendly.find(args[:slug] || args[:id])
      end

      Page.published.friendly.find(args[:slug] || args[:id])
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new(
        "Could not find Page with id=#{args[:id]} or slug=#{args[:slug]}"
      )
    end
  end
end
