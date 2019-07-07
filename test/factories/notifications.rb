# frozen_string_literal: true

FactoryBot.define do
  factory :notification do
    statement_text { "Lorem ipsum" }
    full_text { "Lorem ipsum" }

    trait :unread do
      read_at { nil }
    end

    trait :read do
      read_at { Time.now }
    end
  end
end
