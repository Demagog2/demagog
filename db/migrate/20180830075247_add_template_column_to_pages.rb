# frozen_string_literal: true

class AddTemplateColumnToPages < ActiveRecord::Migration[5.2]
  def change
    add_column :pages, :template, :string
  end
end
