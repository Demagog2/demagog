# frozen_string_literal: true

FactoryBot.define do
  factory :notification do
    content { "Lorem ipsum" }
    action_link { "http://example.com" }
    action_text { "My action" }

    trait :unread do
      read_at { nil }
    end

    trait :read do
      read_at { Time.now }
    end
  end
end
