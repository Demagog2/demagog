class SingleStatementArticleType < ActiveRecord::Migration[6.0]
  def up
    execute "INSERT INTO article_types (name, template, created_at, updated_at) VALUES ('single_statement', NULL, NOW(), NOW())"
    add_column :article_segments, :statement_id, :string
  end

  def down
    execute "DELETE FROM article_types WHERE name = 'single_statement'"
    remove_column :article_segments, :statement_id
  end
end
