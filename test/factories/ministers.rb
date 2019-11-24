# frozen_string_literal: true

FactoryBot.define do
  factory :minister do
    government_id { 1 }
    speaker_id { 1 }
    name { "Prime Minister" }
    ordering { 1 }
  end
end
