# frozen_string_literal: true

namespace :source do
  desc "Copy source with all its statements, assessments, etc."
  task :deep_copy, [:source_id] => [:environment] do |task, args|
    raise Exception.new("Please provide source_id argument, e.g. rake source:deep_copy[123]") if args.source_id.nil?

    # Make SQL queries part of the rake task output
    # ActiveRecord::Base.logger = Logger.new STDOUT

    Source.transaction do
      source = Source.find(args.source_id)
      new_source = source.dup
      new_source.name = "#{source.name} (copy)"
      new_source.media_personalities = source.media_personalities
      new_source.speakers = source.speakers
      new_source.created_at = source.created_at
      new_source.save!
      p "Creating source #{new_source.inspect}"

      source.statements.each do |statement|
        new_statement = statement.dup
        new_statement.source = new_source
        new_statement.tags = statement.tags
        new_statement.published = false
        new_statement.created_at = statement.created_at
        new_statement.save!
        p "Creating statement #{new_statement.inspect}"

        new_assessment = statement.assessment.dup
        new_assessment.statement = new_statement
        new_assessment.created_at = statement.assessment.created_at
        new_assessment.save!
        p "Creating assessment #{new_assessment.inspect}"

        statement.comments.each do |comment|
          new_comment = comment.dup
          new_comment.statement = new_statement
          new_comment.created_at = comment.created_at
          new_comment.save!
          # p "Creating comment #{new_comment.inspect}"
        end
      end

      # raise Exception.new("yo")
      puts "-------------------------------------------------------"
      puts "YAY! Done!"
      puts "Created source #{new_source.name} (##{new_source.id})"
    end
  end
end
