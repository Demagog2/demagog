# frozen_string_literal: true

class SetTemplateToAboutUsPage < ActiveRecord::Migration[5.2]
  def up
    page = Page.find_by(slug: "o-nas")
    if page
      page.template = "about_us"
      page.save!
      say "Page `about-us` template was updated"
    end
  end
end
