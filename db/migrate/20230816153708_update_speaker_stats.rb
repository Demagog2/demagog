# frozen_string_literal: true

class UpdateSpeakerStats < ActiveRecord::Migration[7.0]
  def change
    update_view :speaker_stats, version: 6, revert_to_version: 5
  end
end
