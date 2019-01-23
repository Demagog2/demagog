class RemoveDuplicateSeedRecords < ActiveRecord::Migration[5.2]
  def change
    # Roles
    preserve_role_ids = []
    preserve_role_ids << Role.find_by(key: "admin", name: "Administrátor").id
    preserve_role_ids << Role.find_by(key: "expert", name: "Expert").id
    preserve_role_ids << Role.find_by(key: "social_media_manager", name: "Síťař").id
    preserve_role_ids << Role.find_by(key: "proofreader", name: "Korektor").id
    preserve_role_ids << Role.find_by(key: "intern", name: "Stážista").id
    Role.where.not(id: preserve_role_ids).delete_all

    # Article types
    preserve_article_type_ids = []
    preserve_article_type_ids << ArticleType.find_by(name: "default").id if ArticleType.find_by(name: "default")
    preserve_article_type_ids << ArticleType.find_by(name: "static").id if ArticleType.find_by(name: "static")
    ArticleType.where.not(id: preserve_article_type_ids).delete_all
  end
end
