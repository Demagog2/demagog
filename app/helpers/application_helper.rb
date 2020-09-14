# frozen_string_literal: true

module ApplicationHelper
  def cs_pluralize(num, one, two_to_four, other)
    text = other
    text = two_to_four if num >= 2 && num <= 4
    text = one if num == 1

    sprintf(text, num: num)
  end

  def get_web_content(system_id, key)
    web_content = WebContent.find_by(system_id: system_id)
    web_content ? web_content.data.fetch(key, "") : ""
  end
end
