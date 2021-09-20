# frozen_string_literal: true

class AddPortraitToSpeaker < ActiveRecord::Migration[5.1]
  def change
    add_reference :speakers, :attachment, index: true
  end
end
