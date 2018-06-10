# frozen_string_literal: true

include ActionDispatch::TestProcess

FactoryBot.define do
  factory :attachment, aliases: [:illustration] do
    file "photo.png"
  end

  factory :media_personality

  factory :medium

  factory :source do
    name "Source name"
    medium
    media_personality
    released_at { 1.week.ago }

    after(:create) do |source|
      create_list(:fact_check, 1, source: source)
    end
  end

  factory :article_type

  factory :article do
    sequence :title do |n|
      "Article title #{n}"
    end

    source
    illustration
    published_at { 1.day.ago }

    factory :fact_check do
      association :article_type, factory: :article_type, name: "fact_check"
    end

    factory :static do
      association :article_type, factory: :article_type, name: "static"
    end
  end

  factory :body do
    transient do
      member_count 5
    end

    after(:create) do |party, evaluator|
      create_list(:membership, evaluator.member_count, body: party)
    end

    factory :presidential_candidates do
      name "Presidental candidates"

      is_party false
    end

    factory :party do
      name "Party A"
      short_name "pa"

      is_party true
    end
  end

  factory :user

  factory :assessment do
    statement
    user
    association :veracity, factory: :true

    evaluation_status Assessment::STATUS_CORRECT
  end

  factory :veracity do
    initialize_with { Veracity.find_or_create_by name: name, key: key }

    factory :true do
      name "True"
      key Veracity::TRUE
    end

    factory :untrue do
      name "Untrue"
      key Veracity::UNTRUE
    end

    factory :misleading do
      name "Misleading"
      key Veracity::MISLEADING
    end

    factory :unverifiable do
      name "Unverifiable"
      key Veracity::UNVERIFIABLE
    end
  end

  factory :statement do
    speaker
    source
    content "Lorem ipsum dolor sit amet"
    published true
    count_in_statistics true
    excerpted_at { 1.month.ago }

    after(:create) do |statement|
      create(:assessment, statement: statement, veracity: create(:true))
    end

    factory :important_statement do
      important true
    end
  end

  factory :membership do
    speaker
    body
  end

  factory :speaker do
    first_name "John"
    last_name  "Doe"

    transient do
      statement_count 3
      statement_source nil
    end

    after(:create) do |speaker, evaluator|
      statement_props = { speaker: speaker }
      statement_props[:source] = evaluator.statement_source if evaluator.statement_source

      create_list(:important_statement, evaluator.statement_count, statement_props)
    end

    factory :speaker_with_party do
      transient do
        memberships_count 1
      end

      after(:create) do |speaker, evaluator|
        create_list(:membership, evaluator.memberships_count, speaker: speaker)
      end
    end
  end
end
