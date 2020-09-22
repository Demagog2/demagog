class FacebookFactcheckArticleType < ActiveRecord::Migration[6.0]
  def up
    execute "INSERT INTO article_types (name, template, created_at, updated_at) VALUES ('facebook_factcheck', NULL, NOW(), NOW())"
  end

  def down
    execute "DELETE FROM article_types WHERE name = 'facebook_factcheck'"
  end
end
