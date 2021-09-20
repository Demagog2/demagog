# frozen_string_literal: true

class UpdateSpeakerStatsToVersion2 < ActiveRecord::Migration[6.0]
  def change
    update_view :speaker_stats, version: 2, revert_to_version: 1
  end
end
