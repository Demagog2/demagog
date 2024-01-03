# frozen_string_literal: true

module Schema::MenuItems::Types
  class MenuItemType < GraphQL::Schema::Union
    possible_types MenuItemDividerType, MenuItemPageType

    def self.resolve_type(object, _ctx)
      if object.is_page?
        MenuItemPageType
      else
        MenuItemDividerType
      end
    end
  end
end
