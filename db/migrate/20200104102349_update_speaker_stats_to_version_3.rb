# frozen_string_literal: true

class UpdateSpeakerStatsToVersion3 < ActiveRecord::Migration[6.0]
  def change
    update_view :speaker_stats, version: 3, revert_to_version: 2
  end
end
