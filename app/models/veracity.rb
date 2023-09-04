# frozen_string_literal: true

class Veracity < ApplicationRecord
  TRUE = "true"
  UNTRUE = "untrue"
  MISLEADING = "misleading"
  UNVERIFIABLE = "unverifiable"

  has_many :assessments
end
