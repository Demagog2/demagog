# frozen_string_literal: true

require "elasticsearch/rails/tasks/import"

namespace :elasticsearch do
  desc "Reindex everything (articles + speakers + statements)"
  task reindex: %w[elasticsearch:reindex_articles elasticsearch:reindex_speakers elasticsearch:reindex_statements]

  desc "Reindex articles"
  task :reindex_articles, [] => [:environment] do |task, args|
    Article.import force: true, batch_size: 10
  end

  desc "Reindex speakers"
  task :reindex_speakers, [] => [:environment] do |task, args|
    Speaker.import force: true, batch_size: 10
  end

  desc "Reindex statements"
  task :reindex_statements, [] => [:environment] do |task, args|
    Statement.import force: true, batch_size: 10
  end

  desc "Delete all indexes"
  task :delete_indexes, [] => [:environment] do |task, args|
    [Article, Speaker, Statement].each do |model_class|
      model_class.__elasticsearch__.delete_index! if model_class.__elasticsearch__.index_exists?
    end
  end

  desc "Create all indexes"
  task :create_indexes, [] => [:environment] do |task, args|
    [Article, Speaker, Statement].each do |model_class|
      model_class.__elasticsearch__.create_index! unless model_class.__elasticsearch__.index_exists?
    end
  end
end
