# frozen_string_literal: true

namespace :statement do
  generate_preview_image_desc = <<-DESC.gsub(/    /, "")
    Generate preview image for statement (pass STATEMENT_ID as environment variable).
      $ rake statement:generate_preview_image STATEMENT_ID=123
    To debug generated preview image by storing it to storage/ directory, pass DEBUG=true:
      $ rake statement:generate_preview_image STATEMENT_ID=123 DEBUG=true
  DESC
  desc generate_preview_image_desc
  task :generate_preview_image, [] => [:environment] do |task, args|
    if ENV["STATEMENT_ID"].to_s == ""
      puts "=" * 90, "USAGE", "=" * 90, generate_preview_image_desc, ""
      exit(1)
    end

    statement_id = ENV["STATEMENT_ID"].to_i
    debug = ENV.fetch("DEBUG", nil) == "true"

    GenerateStatementPreviewImageService.generate(statement_id, debug)
  end
end
