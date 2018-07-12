class CreateContentImages < ActiveRecord::Migration[5.2]
  def change
    create_table :content_images do |t|
      t.string :title
      t.datetime :created_at, null: false
    end
  end
end
