# frozen_string_literal: true

class CreateAttachments < ActiveRecord::Migration[5.1]
  def change
    create_table :attachments do |t|
      t.string :type
      t.string :file
      t.text :description
      t.string :source_url

      t.timestamps
    end
  end
end
