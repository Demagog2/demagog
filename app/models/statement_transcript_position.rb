# frozen_string_literal: true

class StatementTranscriptPosition < ApplicationRecord
  belongs_to :statement
  belongs_to :source
end
