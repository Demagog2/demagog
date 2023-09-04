# frozen_string_literal: true

FactoryBot.define do
  factory :article_tag do
    sequence(:title) { |n| "Tag #{n}" }
    description { "Lorem ipsum..." }
  end
end
