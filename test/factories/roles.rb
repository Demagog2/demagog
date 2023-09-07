# frozen_string_literal: true

FactoryBot.define do
  factory :role do
    key { Role::ADMIN }

    trait :admin do
      key { Role::ADMIN }
    end

    trait :social_media_manager do
      key { Role::SOCIAL_MEDIA_MANAGER }
    end

    trait :intern do
      key { Role::INTERN }
    end
  end
end
