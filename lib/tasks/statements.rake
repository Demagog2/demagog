# frozen_string_literal: true

namespace :statements do
  generate_preview_image_desc = <<-DESC.gsub(/    /, "")
    Generate preview image for statement (pass STATEMENT_ID as environment variable).
      $ rake statements:generate_preview_image STATEMENT_ID=123
    To debug generated preview image by storing it to storage/ directory, pass DEBUG=true:
      $ rake statements:generate_preview_image STATEMENT_ID=123 DEBUG=true
    To run it async in sidekiq, add ASYNC=true
      $ rake statements:generate_preview_image STATEMENT_ID=123 ASYNC=true
  DESC
  desc generate_preview_image_desc
  task :generate_preview_image, [] => [:environment] do |task, args|
    if ENV["STATEMENT_ID"].to_s == ""
      puts "=" * 90, "USAGE", "=" * 90, generate_preview_image_desc, ""
      exit(1)
    end

    statement_id = ENV["STATEMENT_ID"].to_i
    debug = ENV.fetch("DEBUG", nil) == "true"
    async = ENV.fetch("ASYNC", nil) == "true"

    if async
      GenerateStatementPreviewImageWorker.perform_async(statement_id, debug)
    else
      GenerateStatementPreviewImageWorker.new.perform(statement_id, debug)
    end
  end

  generate_all_preview_images_desc = <<-DESC.gsub(/    /, "")
    Generate preview images for all statements
      $ rake statements:generate_all_preview_images
    To run it async in sidekiq, add ASYNC=true
      $ rake statements:generate_all_preview_images ASYNC=true
  DESC
  desc generate_all_preview_images_desc
  task :generate_all_preview_images, [] => [:environment] do |task, args|
    async = ENV.fetch("ASYNC", nil) == "true"

    Statement.factual_and_published.each do |statement|
      if async
        GenerateStatementPreviewImageWorker.perform_async(statement.id)
      else
        GenerateStatementPreviewImageWorker.new.perform(statement.id)
      end
    end
  end
end
