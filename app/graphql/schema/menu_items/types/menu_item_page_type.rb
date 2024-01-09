# frozen_string_literal: true

module Schema::MenuItems::Types
  class MenuItemPageType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: true
    field :page, Types::PageType, null: true
  end
end
