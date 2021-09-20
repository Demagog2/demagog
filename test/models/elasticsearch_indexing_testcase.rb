# frozen_string_literal: true

require "test_helper"
require "sidekiq/testing"

class ElasticsearchIndexingTestCase < ActiveSupport::TestCase
  teardown do
    Sidekiq::Worker.clear_all
  end

  # Asserts sidekiq job with given model name and operation was queued
  #
  # @param [Hash] options
  # @option options [String] :name model name
  # @option options [String] :operation indexing operation (index, update, destroy)
  def assert_indexing_job_queued(options = {}, &block)
    model_name = options.fetch(:name)
    operation = options.fetch(:operation)

    expected_diff = -> do
      jobs = ElasticsearchWorker.jobs

      jobs.map { |job| job["args"].first(2) }.count do |job_args|
        job_args == [model_name, operation]
      end
    end

    assert_changes expected_diff, "Expected ElasticSearchWorker(#{model_name}, #{operation}) job to be queued", &block
  end
end
