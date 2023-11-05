# frozen_string_literal: true

require_relative "../elasticsearch_indexing_testcase"

class StatementElasticsearchIndexingTest < ElasticsearchIndexingTestCase
  test "indexing document on create" do
    source = create(:source)
    speaker = create(:speaker)
    source_speaker = create(:source_speaker, speaker:, source:)

    assert_indexing_job_queued(name: "statement", operation: "index") do
      subject = build(:statement, source_speaker:)

      subject.save!
    end
  end

  test "indexing document on update" do
    source = create(:source)
    speaker = create(:speaker)
    source_speaker = create(:source_speaker, speaker:, source:)
    subject = create(:statement, source_speaker:)

    assert_indexing_job_queued(name: "statement", operation: "update") do
      subject.content = "Jimmy"
      subject.save!
    end
  end

  test "indexing document on destroy" do
    source = create(:source)
    speaker = create(:speaker)
    source_speaker = create(:source_speaker, speaker:, source:)
    subject = create(:statement, source_speaker:)

    assert_indexing_job_queued(name: "statement", operation: "destroy") do
      subject.discard
    end
  end
end
