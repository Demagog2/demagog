# frozen_string_literal: true

class StatementVideoMark < ApplicationRecord
  belongs_to :source
  belongs_to :statement
end
