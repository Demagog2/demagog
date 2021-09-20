# frozen_string_literal: true

class RenameTypeToAttachmentType < ActiveRecord::Migration[5.1]
  def change
    rename_column :attachments, :type, :attachment_type
  end
end
