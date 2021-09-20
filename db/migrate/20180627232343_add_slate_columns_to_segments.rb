# frozen_string_literal: true

class AddSlateColumnsToSegments < ActiveRecord::Migration[5.2]
  def change
    rename_column :segments, :text, :text_html
    add_column :segments, :text_slatejson, :text
  end
end
