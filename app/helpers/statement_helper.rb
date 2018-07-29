# frozen_string_literal: true

module StatementHelper
  def content_to_html(content)
    content.gsub(/^[„““”\"]+|[„““”\"]+$/, "").gsub(/\n/, "<br>").html_safe
  end
end
