# frozen_string_literal: true

FactoryBot.define do
  factory :menu_item do
    sequence(:order)

    trait :divider do
      kind { MenuItem::KIND_DIVIDER }
    end

    trait :page do
      kind { MenuItem::KIND_PAGE }
      page
    end
  end
end
