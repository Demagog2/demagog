# frozen_string_literal: true

require "tempfile"

class GenerateStatementPreviewImageService
  def self.generate(statement_id, debug = false)
    puts("debug: running in debug mode, not changing the preview_image on statement") if debug

    statement = Statement.find_by(id: statement_id)

    raise Exception.new("Could not find statement with ID #{statement_id}") unless statement
    raise Exception.new("Statement ID #{statement_id} is not published") unless statement.published

    preview_image_url = "#{ENV['BASE_URL']}/vyrok-nahled/#{statement.id}"

    # Do a screenshot using chromium
    browser = Ferrum::Browser.new(timeout: 10, window_size: [1000, 500])
    browser.goto(preview_image_url)

    if !browser.network.response || browser.network.response.status != 200
      raise Exception.new("HTTP response status from #{preview_image_url} was not 200")
    end

    tmpfile = Tempfile.new("demagog-statementpreviewimage-")

    browser.screenshot(path: tmpfile.path, format: "png", selector: "body")
    browser.quit

    if debug
      tmpfile.rewind

      debug_file_name = "statement-#{statement.id}-preview-image-#{SecureRandom.alphanumeric(10)}.png"
      debug_file_path = "#{Rails.root}/storage/#{debug_file_name}"

      FileUtils.cp(tmpfile.path, debug_file_path)

      puts("debug: generated preview image written to #{debug_file_path}")
    else
      statement.preview_image.attach io: tmpfile, filename: "vyrok-#{statement.id}.png"
    end

    tmpfile.close
    tmpfile.unlink
  end
end
