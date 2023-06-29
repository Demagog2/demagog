class CreateArticleTags < ActiveRecord::Migration[6.1]
  def change
    create_table :article_tags do |t|
      t.string :title
      t.string :slug
      t.text :description
      t.belongs_to :medium, index: true, null: true
      t.string :video_url
      t.integer :stats, default: 0
      t.boolean :public
      t.boolean :speakers

      t.timestamps
    end

    create_table :article_tag_speakers do |t|
      t.belongs_to :article_tag, index: true, null: true
      t.belongs_to :speaker, index: true, null: true
      # TODO: Maybe rather source speaker?
      # t.belongs_to :source_speaker, index: true, null: true
      t.integer :order, default: 0

      t.timestamps
    end

    change_table :statements do |t|
      t.belongs_to :article_tag, index: true, null: true
    end
  end
end
