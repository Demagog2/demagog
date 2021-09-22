# frozen_string_literal: true

# We use this for keeping speaker data for each source separately, because the name,
# body membership or role change and we want to keep on the source what was the status
# when they were part of that one discussion. Also because the role or body membership
# can change based on the discussion context (eg. politician can be part of one party on
# national level, but different one on municipal level).
class SourceSpeaker < ApplicationRecord
  belongs_to :speaker
  belongs_to :body, optional: true
  has_many :statements

  def full_name
    "#{first_name} #{last_name}"
  end
end
