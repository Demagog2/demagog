# frozen_string_literal: true

class CreateSpeakerStats < ActiveRecord::Migration[5.2]
  def change
    create_view :speaker_stats
  end
end
