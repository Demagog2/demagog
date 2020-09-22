class AddWebContents < ActiveRecord::Migration[6.0]
  def up
    create_table :web_contents do |t|
      t.string :system_id
      t.string :name, null: false
      t.string :url_path, null: true
      t.boolean :dynamic_page, default: false
      t.boolean :dynamic_page_published, default: false
      t.json :structure, null: false, default: "[]"
      t.json :data, null: false, default: "{}"

      t.timestamps
    end

    WebContent.create(
      system_id: "article.discussions",
      name: "Stránka Factcheck / Diskuze",
      url_path: "/diskuze",
      structure: [
        {
          key: "title",
          item_type: "heading",
          name: "Titulek stránky"
        },
        {
          key: "intro",
          item_type: "richtext",
          name: "Intro text stránky"
        }
      ],
      data: {
        title: "",
        intro: ""
      }
    )

    WebContent.create(
      system_id: "article.social_media",
      name: "Stránka Factcheck / Sociální sítě",
      url_path: "/socialni-site",
      structure: [
        {
          key: "title",
          item_type: "heading",
          name: "Titulek stránky"
        },
        {
          key: "intro",
          item_type: "richtext",
          name: "Intro text stránky"
        }
      ],
      data: {
        title: "",
        intro: ""
      }
    )

    WebContent.create(
      system_id: "article.collaboration_with_facebook",
      name: "Stránka Factcheck / Spolupráce s Facebookem",
      url_path: "/spoluprace-s-facebookem",
      structure: [
        {
          key: "title",
          item_type: "heading",
          name: "Titulek stránky"
        },
        {
          key: "intro",
          item_type: "richtext",
          name: "Intro text stránky"
        }
      ],
      data: {
        title: "",
        intro: ""
      }
    )

    WebContent.create(
      system_id: "article.editorials",
      name: "Stránka Komentáře",
      url_path: "/komentare",
      structure: [
        {
          key: "title",
          item_type: "heading",
          name: "Titulek stránky"
        },
        {
          key: "intro",
          item_type: "richtext",
          name: "Intro text stránky"
        }
      ],
      data: {
        title: "",
        intro: ""
      }
    )
  end

  def down
    raise Error.new("Not implemented")
  end
end
