# frozen_string_literal: true

module Schema::MenuItems::MenuItemsField
  extend ActiveSupport::Concern

  included do
    field :menu_items, [Schema::MenuItems::Types::MenuItemType], null: false

    def menu_items
      MenuItem.ordered.includes(:page)
    end
  end
end
