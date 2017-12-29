# frozen_string_literal: true

module ApplicationHelper
  def speaker_portrait(attachment)
    "#{server}/data/politik/t/#{attachment.file}"
  end

  def article_illustration(attachment, article_type = "default")
    folder = article_type === "static" ? "pages" : "diskusia"

    "#{server}/data/#{folder}/s/#{attachment.file}"
  end

  def user_portrait(attachment)
    if attachment.file.empty?
      "#{server}/data/users/default.png"
    else
      "#{server}/data/users/s/#{attachment.file}"
    end
  end

  private
    def server
      ENV["DEMAGOG_IMAGE_SERVICE_URL"]
    end
end
