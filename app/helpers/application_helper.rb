# frozen_string_literal: true

module ApplicationHelper
  def cs_pluralize(num, one, two_to_four, other)
    text = other
    text = two_to_four if num >= 2 && num <= 4
    text = one if num == 1

    sprintf(text, num: num)
  end
end
