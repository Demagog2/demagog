# frozen_string_literal: true

FactoryBot.define do
  factory :notification do
    content "Lorem ipsum"
    action_link "http://example.com"
    action_text "My action"
  end
end
