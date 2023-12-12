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
      new_source.created_at = source.created_at
      new_source.save!
      p "Creating source #{new_source.inspect}"

      new_source_speaker_id_map = {}

      source.source_speakers.each do |source_speaker|
        new_source_speaker = source_speaker.dup
        new_source_speaker.source = new_source
        new_source_speaker.created_at = source_speaker.created_at
        new_source_speaker.save!
        p "Creating source speaker #{new_source_speaker.inspect}"

        new_source_speaker_id_map[source_speaker.id] = new_source_speaker.id
      end

      source.statements.each do |statement|
        new_statement = statement.dup
        new_statement.source = new_source
        new_statement.source_speaker_id = new_source_speaker_id_map[statement.source_speaker_id]
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

  desc "Propagate promises updates from copied source to the original source"
  task :propagate_promises_updates, [:from_source_id, :to_source_id] => [:environment] do |task, args|
    if args.from_source_id.nil? || args.to_source_id.nil?
      raise Exception.new("Please provide from_source_id and to_source_id arguments, e.g. rake source:propagate_updates[123,456]")
    end

    # Make SQL queries part of the rake task output
    # ActiveRecord::Base.logger = Logger.new STDOUT

    Source.transaction do
      from_source = Source.find(args.from_source_id)
      to_source = Source.find(args.to_source_id)

      from_source.statements.each do |from_statement|
        from_speaker_id = from_statement.source_speaker.speaker_id

        to_statement = Statement.joins(:source_speaker).find_by!(
          # Using title, because content of one of promise statements has been changed
          title: from_statement.title,
          source_id: to_source.id,
          source_speaker: {
            speaker_id: from_speaker_id
          }
        )

        from_assessment = from_statement.assessment
        to_assessment = to_statement.assessment

        # Propagate updated evaluation
        to_assessment.explanation_html = from_assessment.explanation_html
        to_assessment.explanation_slatejson = from_assessment.explanation_slatejson
        to_assessment.promise_rating_id = from_assessment.promise_rating_id
        to_assessment.short_explanation = from_assessment.short_explanation
        to_assessment.save!

        # Propagate new comments
        from_statement.comments.ordered.each do |from_comment|
          Comment.find_or_create_by!(
            content: from_comment.content,
            user_id: from_comment.user_id,
            statement_id: to_statement.id,
            created_at: from_comment.created_at
          )
        end
      end

      # raise Exception.new("yo")

      puts "-------------------------------------------------------"
      puts "YAY! Done!"
      puts "Propagated updates from #{from_source.name} (##{from_source.id}) to #{to_source.name} (##{to_source.id})"
    end
  end

  desc "Soft delete source with all its statements"
  task :deep_soft_delete, [:source_id] => [:environment] do |task, args|
    raise Exception.new("Please provide source_id argument, e.g. rake source:deep_soft_delete[123]") if args.source_id.nil?

    Source.transaction do
      source = Source.find(args.source_id)

      source.statements.each do |statement|
        statement.discard
      end

      source.discard

      puts "-------------------------------------------------------"
      puts "Soft deleted #{source.name} (##{source.id}) and also all its statements"
    end
  end

  desc "Propagate who has the statement assigned as evaluator"
  task :propagate_statements_assignees, [:from_source_id, :to_source_id] => [:environment] do |task, args|
    if args.from_source_id.nil? || args.to_source_id.nil?
      raise Exception.new("Please provide from_source_id and to_source_id arguments, e.g. rake source:propagate_statements_assignees[123,456]")
    end

    Source.transaction do
      from_source = Source.unscoped.find(args.from_source_id)
      to_source = Source.unscoped.find(args.to_source_id)

      Statement.unscoped.where(source_id: from_source.id).each do |from_statement|
        to_statement = Statement.find_by!(
          # Using title, because content of one of promise statements has been changed
          title: from_statement.title,
          speaker_id: from_statement.speaker_id,
          source_id: to_source.id
        )

        from_assessment = from_statement.assessment
        to_assessment = to_statement.assessment

        to_assessment.user_id = from_assessment.user_id
        to_assessment.save!
      end

      puts "-------------------------------------------------------"
      puts "Propagated statements assignees from #{from_source.name} (##{from_source.id}) to #{to_source.name} (##{to_source.id})"
    end
  end
end
