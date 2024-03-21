# frozen_string_literal: true

FactoryBot.define do
  factory :workshop do
    name { "MyString" }
    description { "MyString" }
    image { nil }
    price { 1 }
  end
end
