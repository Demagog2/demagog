# frozen_string_literal: true

include ActionDispatch::TestProcess

FactoryBot.define do
  factory :veracity do
    key { Veracity::TRUE }
  end

  factory :media_personality do
    sequence(:name) { |n| "John #{n} Doe" }
  end

  factory :medium do
    sequence(:name) { |n| "Medium #{n}" }
  end

  factory :source do
    name { "Source name" }
    medium
    released_at { 1.week.ago }
    source_url { "http://example.com" }

    after(:create) { |source| create(:media_personality, sources: [source]) }

    trait :with_video do
      video_type { "youtube" }
      sequence(:video_id)
    end
  end

  factory :article do
    sequence :title do |n|
      "Article title #{n}"
    end

    perex { "Lorem ipsum" }
    published { true }
    published_at { 1.day.ago }

    factory :fact_check do
      article_type { Article::ARTICLE_TYPE_DEFAULT }
    end

    factory :static do
      article_type { Article::ARTICLE_TYPE_STATIC }
    end

    trait :single_stamement do
      article_type { Article::ARTICLE_TYPE_SINGLE_STATEMENT }
    end

    trait :with_illustration do
      after :create do |article|
        file_path = Rails.root.join("test", "fixtures", "files", "speaker.png")
        article.illustration.attach(Rack::Test::UploadedFile.new(file_path, "image/png"))
      end
    end
  end

  factory :article_segment do
    factory :article_segment_text do
      segment_type { "text" }
    end

    factory :article_segment_source_statements do
      segment_type { "source_statements" }
    end

    factory :article_segment_single_statement do
      segment_type { ArticleSegment::TYPE_SINGLE_STATEMENT }
      statement
    end
  end

  factory :body do
    transient { member_count { 5 } }

    after(:create) do |party, evaluator|
      create_list(:membership, evaluator.member_count, body: party)
    end

    factory :presidential_candidates do
      name { "Presidental candidates" }

      is_party { false }
    end

    factory :party do
      name { "Party A" }
      short_name { "pa" }

      is_party { true }
    end
  end

  factory :user do
    first_name { "John" }
    last_name { "Doe" }
    email { "john.doe@demagog.cz" }
    active { true }

    trait :admin do
      role_id { Role.create_or_find_by(key: Role::ADMIN, name: "Administrátor").id }
    end
    trait :expert do
      role_id { Role.create_or_find_by(key: Role::EXPERT, name: "Expert").id }
    end
    trait :social_media_manager do
      role_id { Role.create_or_find_by(key: Role::SOCIAL_MEDIA_MANAGER, name: "Síťař").id }
    end
    trait :proofreader do
      role_id { Role.create_or_find_by(key: Role::PROOFREADER, name: "Korektor").id }
    end
    trait :intern do
      role_id { Role.create_or_find_by(key: Role::INTERN, name: "Stážista").id }
    end

    trait :with_avatar do
      after :create do |user|
        file_path = Rails.root.join("test", "fixtures", "files", "speaker.png")
        user.avatar.attach(Rack::Test::UploadedFile.new(file_path, "image/png"))
      end
    end
  end

  factory :assessment do
    statement
    association :evaluator, factory: :user

    trait :with_veracity_true do
      veracity { Veracity.create_or_find_by(key: Veracity::TRUE) }
      veracity_new { Assessment::VERACITY_TRUE }
    end

    trait :with_veracity_untrue do
      veracity { Veracity.create_or_find_by(key: Veracity::UNTRUE) }
      veracity_new { Assessment::VERACITY_UNTRUE }
    end

    trait :with_veracity_misleading do
      veracity { Veracity.create_or_find_by(key: Veracity::MISLEADING) }
      veracity_new { Assessment::VERACITY_MISLEADING }
    end

    trait :with_veracity_unverifiable do
      veracity { Veracity.create_or_find_by(key: Veracity::UNVERIFIABLE) }
      veracity_new { Assessment::VERACITY_UNVERIFIABLE }
    end

    assessment_methodology do
      AssessmentMethodology.find_by(name: "Demagog.cz fact-checking metodika")
    end

    evaluation_status { Assessment::STATUS_APPROVED }
    explanation_html { "Lorem ipsum <strong>dolor</strong> sit amet" }

    trait :approved do
      evaluation_status { Assessment::STATUS_APPROVED }
    end

    trait :being_evaluated do
      evaluation_status { Assessment::STATUS_BEING_EVALUATED }
    end

    trait :approval_needed do
      evaluation_status { Assessment::STATUS_APPROVAL_NEEDED }
    end

    trait :proofreading_needed do
      evaluation_status { Assessment::STATUS_PROOFREADING_NEEDED }
    end

    trait :promise_assessment do
      veracity { nil }
      promise_rating { PromiseRating.find_by(key: PromiseRating::FULFILLED) }
      assessment_methodology do
        AssessmentMethodology.find_by(
          name: "Demagog.cz metodika analýzy slibů druhé vlády Andreje Babiše"
        )
      end
    end
  end

  factory :tag do
    sequence(:name) { |n| "Tag ##{n}" }
    for_statement_type { Statement::TYPE_FACTUAL }
  end

  factory :statement do
    statement_type { Statement::TYPE_FACTUAL }
    source_speaker
    source
    content { "Lorem ipsum dolor sit amet" }
    published { true }
    excerpted_at { 1.month.ago }
    important { false }

    after(:create) do |statement|
      if statement.statement_type == Statement::TYPE_FACTUAL
        create(:assessment, :with_veracity_true, statement:)
      end
      if statement.statement_type == Statement::TYPE_PROMISE
        # TODO: Add promise rating
        create(:assessment, :promise_assessment, statement:)
      end
    end

    trait :important do
      important { true }
    end

    trait :unpublished do
      published { false }
    end

    trait :with_transcript_position do
      transient { transcript_position { [0, 0, 0, 20] } }

      after(:create) do |statement, evaluator|
        create(
          :statement_transcript_position,
          statement:,
          source: statement.source,
          start_line: evaluator.transcript_position[0],
          start_offset: evaluator.transcript_position[1],
          end_line: evaluator.transcript_position[2],
          end_offset: evaluator.transcript_position[3]
        )
      end
    end

    trait :promise_statement do
      statement_type { Statement::TYPE_PROMISE }
      title { "Promise title" }
    end

    factory :important_statement, traits: %i[important]
    factory :unpublished_statement, traits: %i[unpublished]
  end

  factory :statement_transcript_position

  factory :membership do
    speaker
    body

    trait :current do
      # Needs to be defined this way cause until is reserved word in Ruby
      sequence(:until) { nil }
    end
  end

  factory :speaker do
    first_name { "John" }
    last_name { "Doe" }

    transient do
      statement_count { 3 }
      statement_source { nil }
    end

    factory :speaker_with_party do
      transient { memberships_count { 1 } }

      after(:create) do |speaker, evaluator|
        create_list(:membership, evaluator.memberships_count, speaker:)
      end
    end
  end
end
