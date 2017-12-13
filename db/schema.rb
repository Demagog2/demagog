# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171212234242) do

  create_table "article_has_segments", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "order"
    t.bigint "article_id"
    t.bigint "segment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_article_has_segments_on_article_id"
    t.index ["segment_id"], name: "index_article_has_segments_on_segment_id"
  end

  create_table "article_types", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.text "template"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "articles", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "title"
    t.string "slug"
    t.text "perex"
    t.datetime "published_at"
    t.boolean "published"
    t.bigint "user_id"
    t.bigint "article_type_id"
    t.bigint "source_id"
    t.integer "illustration_id"
    t.integer "document_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_type_id"], name: "index_articles_on_article_type_id"
    t.index ["document_id"], name: "index_articles_on_document_id"
    t.index ["illustration_id"], name: "index_articles_on_illustration_id"
    t.index ["source_id"], name: "index_articles_on_source_id"
    t.index ["user_id"], name: "index_articles_on_user_id"
  end

  create_table "articles_tags", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "tag_id"
    t.bigint "article_id"
    t.index ["article_id"], name: "index_articles_tags_on_article_id"
    t.index ["tag_id"], name: "index_articles_tags_on_tag_id"
  end

  create_table "assessments", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.text "explanation"
    t.string "evaluation_status"
    t.datetime "evaluated_at"
    t.boolean "disputed"
    t.bigint "veracity_id"
    t.bigint "user_id"
    t.bigint "statement_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["statement_id"], name: "index_assessments_on_statement_id"
    t.index ["user_id"], name: "index_assessments_on_user_id"
    t.index ["veracity_id"], name: "index_assessments_on_veracity_id"
  end

  create_table "attachments", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "attachment_type"
    t.string "file"
    t.text "description"
    t.string "source_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comments", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.text "content"
    t.bigint "user_id"
    t.bigint "statement_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["statement_id"], name: "index_comments_on_statement_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "friendly_id_slugs", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id"
    t.index ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type"
  end

  create_table "media", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "kind"
    t.string "name"
    t.text "description"
    t.bigint "attachment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["attachment_id"], name: "index_media_on_attachment_id"
  end

  create_table "media_media_personalities", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "medium_id"
    t.bigint "media_personality_id"
    t.index ["media_personality_id"], name: "index_media_media_personalities_on_media_personality_id"
    t.index ["medium_id"], name: "index_media_media_personalities_on_medium_id"
  end

  create_table "media_personalities", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "kind"
    t.string "name"
    t.text "description"
    t.bigint "attachment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["attachment_id"], name: "index_media_personalities_on_attachment_id"
  end

  create_table "memberships", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "party_id"
    t.bigint "speaker_id"
    t.datetime "since"
    t.datetime "until"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["party_id"], name: "index_memberships_on_party_id"
    t.index ["speaker_id"], name: "index_memberships_on_speaker_id"
  end

  create_table "parties", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.string "short_name"
    t.text "description", limit: 4294967295
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "attachment_id"
    t.index ["attachment_id"], name: "index_parties_on_attachment_id"
  end

  create_table "roles", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "segment_has_statements", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "segment_id"
    t.bigint "statement_id"
    t.integer "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["segment_id"], name: "index_segment_has_statements_on_segment_id"
    t.index ["statement_id"], name: "index_segment_has_statements_on_statement_id"
  end

  create_table "segments", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "segment_type"
    t.text "text", limit: 4294967295
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sources", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.text "transcript", limit: 4294967295
    t.string "source_url"
    t.datetime "released_at"
    t.bigint "medium_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "media_personality_id"
    t.index ["media_personality_id"], name: "index_sources_on_media_personality_id"
    t.index ["medium_id"], name: "index_sources_on_medium_id"
  end

  create_table "speakers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "before_name"
    t.string "first_name"
    t.string "last_name"
    t.string "after_name"
    t.text "bio"
    t.string "website_url"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "attachment_id"
    t.index ["attachment_id"], name: "index_speakers_on_attachment_id"
  end

  create_table "statements", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.text "content"
    t.text "questionables"
    t.datetime "excerpted_at"
    t.boolean "important"
    t.boolean "published"
    t.boolean "count_in_statistics"
    t.bigint "speaker_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "source_id"
    t.index ["source_id"], name: "index_statements_on_source_id"
    t.index ["speaker_id"], name: "index_statements_on_speaker_id"
  end

  create_table "tags", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.text "description"
    t.boolean "is_policy_area"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "first_name"
    t.string "last_name"
    t.text "position_description"
    t.text "bio"
    t.string "email"
    t.string "password"
    t.string "phone"
    t.datetime "registered_at"
    t.integer "order"
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "portrait_id"
    t.integer "rank"
  end

  create_table "users_roles", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "veracities", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "key"
  end

end
