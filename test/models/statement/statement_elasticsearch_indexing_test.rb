# frozen_string_literal: true

require_relative "../elasticsearch_indexing_testcase"

class StatementElasticsearchIndexingTest < ElasticsearchIndexingTestCase
  test "indexing document on create" do
    speaker = create(:speaker)

    assert_indexing_job_queued(name: "statement", operation: "index") do
      subject = build(:statement, speaker:)

      subject.save!
    end
  end

  test "indexing document on update" do
    subject = create(:statement)

    assert_indexing_job_queued(name: "statement", operation: "update") do
      subject.content = "Jimmy"
      subject.save!
    end
  end

  test "indexing document on destroy" do
    subject = create(:statement)

    assert_indexing_job_queued(name: "statement", operation: "destroy") do
      subject.discard
    end
  end
end
