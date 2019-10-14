# frozen_string_literal: true

FactoryBot.define do
  factory :statement_video_mark do
    start { 1 }
    stop { 1 }
    source
    statement
  end
end
