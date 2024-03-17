# frozen_string_literal: true

FactoryBot.define do
  factory :source_speaker do
    first_name { "John" }
    last_name { "Doe" }
    role { "Member of Parliament" }
    speaker
    source

    trait :with_body do
      body
    end
  end
end
