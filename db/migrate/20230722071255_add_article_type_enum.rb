class AddArticleTypeEnum < ActiveRecord::Migration[6.1]
  def up
    execute <<-SQL
      CREATE TYPE article_type AS ENUM ('default', 'static', 'single_statement', 'facebook_factcheck');
    SQL

    add_column :articles, :article_type, :article_type, default: 'default'

    execute <<-SQL
      UPDATE articles SET article_type = 'default' WHERE id IN (
        SELECT articles.id FROM articles JOIN article_types ON articles.article_type_id = article_types.id WHERE name = 'default'
      );
      UPDATE articles SET article_type = 'static' WHERE id IN (
        SELECT articles.id FROM articles JOIN article_types ON articles.article_type_id = article_types.id WHERE name = 'static'
      );
      UPDATE articles SET article_type = 'single_statement' WHERE id IN (
        SELECT articles.id FROM articles JOIN article_types ON articles.article_type_id = article_types.id WHERE name = 'single_statement'
      );
      UPDATE articles SET article_type = 'facebook_factcheck' WHERE id IN (
        SELECT articles.id FROM articles JOIN article_types ON articles.article_type_id = article_types.id WHERE name = 'facebook_factcheck'
      );
    SQL
  end

  def down
    remove_column :articles, :article_type

    execute <<-SQL
      DROP TYPE article_type;
    SQL
  end
end
