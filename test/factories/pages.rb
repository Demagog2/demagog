# frozen_string_literal: true

FactoryBot.define do
  factory :page do
    sequence(:title) { |n| "Page title #{n}" }
    published { false }

    text_html { "MyString" }
    text_slatejson { "MyString" }

    trait :published do
      published { true }
    end
  end
end
