# frozen_string_literal: true

require "test_helper"
require "sidekiq/testing"


class ElasticsearchWorkerTest < ActiveSupport::TestCase
  MODELS = [Speaker]

  setup do
    allow_net_connect!
    elasticsearch_index MODELS
  end

  teardown do
    elasticsearch_cleanup MODELS
    disable_net_connect!
  end

  test "indexing new models" do
    speaker = create(:speaker)

    # Call refresh to make sure the changes are available
    speaker.__elasticsearch__.client.indices.refresh index: speaker.__elasticsearch__.index_name

    assert_changes -> { Speaker.search(speaker.first_name).size }, "Expected model to be indexed" do
      subject = ElasticsearchWorker.new
      subject.perform(:speaker, :index, speaker.id)

      speaker.__elasticsearch__.client.indices.refresh index: speaker.__elasticsearch__.index_name
    end
  end

  test "updating existing models" do
    speaker = create(:speaker)
    speaker.__elasticsearch__.index_document

    new_name = "Jimmy"

    # Call refresh to make sure the changes are available
    speaker.__elasticsearch__.client.indices.refresh index: speaker.__elasticsearch__.index_name

    assert_changes -> { Speaker.search(new_name).size }, "Expected model to be updated" do
      speaker.update_attribute :first_name, new_name

      subject = ElasticsearchWorker.new
      subject.perform(:speaker, :update, speaker.id)

      speaker.__elasticsearch__.client.indices.refresh index: speaker.__elasticsearch__.index_name
    end
  end

  test "deleting models" do
    speaker = create(:speaker)
    speaker.__elasticsearch__.index_document

    # Call refresh to make sure the changes are available
    speaker.__elasticsearch__.client.indices.refresh index: speaker.__elasticsearch__.index_name

    assert_changes -> { Speaker.search(speaker.first_name).size }, "Expected model to be deleted" do
      subject = ElasticsearchWorker.new
      subject.perform(:speaker, :destroy, speaker.id)

      speaker.__elasticsearch__.client.indices.refresh index: speaker.__elasticsearch__.index_name
    end
  end
end
