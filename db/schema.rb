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

ActiveRecord::Schema.define(version: 2018_12_31_132102) do

  create_table "active_storage_attachments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "article_has_segments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "order"
    t.bigint "article_id"
    t.bigint "segment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_article_has_segments_on_article_id"
    t.index ["segment_id"], name: "index_article_has_segments_on_segment_id"
  end

  create_table "article_types", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.text "template"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "articles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "title"
    t.string "slug"
    t.text "perex"
    t.datetime "published_at"
    t.boolean "published"
    t.bigint "user_id"
    t.bigint "article_type_id"
    t.integer "illustration_id"
    t.integer "document_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["article_type_id"], name: "index_articles_on_article_type_id"
    t.index ["document_id"], name: "index_articles_on_document_id"
    t.index ["illustration_id"], name: "index_articles_on_illustration_id"
    t.index ["user_id"], name: "index_articles_on_user_id"
  end

  create_table "articles_tags", id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "tag_id"
    t.bigint "article_id"
    t.index ["article_id"], name: "index_articles_tags_on_article_id"
    t.index ["tag_id"], name: "index_articles_tags_on_tag_id"
  end

  create_table "assessments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.text "explanation_html"
    t.string "evaluation_status"
    t.datetime "evaluated_at"
    t.bigint "veracity_id"
    t.bigint "user_id"
    t.bigint "statement_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "explanation_slatejson"
    t.text "short_explanation"
    t.index ["statement_id"], name: "index_assessments_on_statement_id"
    t.index ["user_id"], name: "index_assessments_on_user_id"
    t.index ["veracity_id"], name: "index_assessments_on_veracity_id"
  end

  create_table "attachments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "attachment_type"
    t.string "file"
    t.text "description"
    t.string "source_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "bodies", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.string "short_name"
    t.text "description", limit: 4294967295
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "attachment_id"
    t.boolean "is_party"
    t.boolean "is_inactive", default: false
    t.string "link"
    t.date "founded_at"
    t.date "terminated_at"
    t.index ["attachment_id"], name: "index_bodies_on_attachment_id"
  end

  create_table "comments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.text "content", null: false
    t.bigint "user_id", null: false
    t.bigint "statement_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["statement_id"], name: "index_comments_on_statement_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "content_images", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.index ["user_id"], name: "index_content_images_on_user_id"
  end

  create_table "friendly_id_slugs", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
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

  create_table "media", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "kind"
    t.string "name"
    t.text "description"
    t.bigint "attachment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["attachment_id"], name: "index_media_on_attachment_id"
  end

  create_table "media_personalities", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "kind"
    t.string "name"
    t.text "description"
    t.bigint "attachment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["attachment_id"], name: "index_media_personalities_on_attachment_id"
  end

  create_table "memberships", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "body_id"
    t.bigint "speaker_id"
    t.date "since"
    t.date "until"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["body_id"], name: "index_memberships_on_body_id"
    t.index ["speaker_id"], name: "index_memberships_on_speaker_id"
  end

  create_table "menu_items", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "title"
    t.string "kind", null: false
    t.bigint "page_id"
    t.integer "order", null: false
    t.datetime "created_at", null: false
    t.index ["page_id"], name: "index_menu_items_on_page_id"
  end

  create_table "notifications", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.text "content", null: false
    t.string "action_link", null: false
    t.string "action_text", null: false
    t.bigint "recipient_id", null: false
    t.datetime "created_at", null: false
    t.datetime "read_at"
    t.datetime "emailed_at"
    t.index ["recipient_id"], name: "index_notifications_on_recipient_id"
  end

  create_table "pages", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "title"
    t.string "slug"
    t.boolean "published"
    t.text "text_html"
    t.text "text_slatejson"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "template"
  end

  create_table "roles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
  end

  create_table "segments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "segment_type"
    t.text "text_html", limit: 4294967295
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "text_slatejson"
    t.bigint "source_id"
  end

  create_table "sources", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.text "transcript", limit: 4294967295
    t.string "source_url"
    t.date "released_at"
    t.bigint "medium_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name", null: false
    t.datetime "deleted_at"
    t.bigint "expert_id"
    t.index ["medium_id"], name: "index_sources_on_medium_id"
  end

  create_table "sources_media_personalities", id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "source_id"
    t.bigint "media_personality_id"
    t.index ["media_personality_id"], name: "index_sources_media_personalities_on_media_personality_id"
    t.index ["source_id"], name: "index_sources_media_personalities_on_source_id"
  end

  create_table "sources_speakers", id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "source_id"
    t.bigint "speaker_id"
    t.index ["source_id"], name: "index_sources_speakers_on_source_id"
    t.index ["speaker_id"], name: "index_sources_speakers_on_speaker_id"
  end

  create_table "speakers", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "before_name"
    t.string "first_name"
    t.string "last_name"
    t.string "after_name"
    t.text "bio"
    t.string "website_url"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "statement_transcript_positions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "statement_id"
    t.bigint "source_id"
    t.integer "start_line", null: false
    t.integer "start_offset", null: false
    t.integer "end_line", null: false
    t.integer "end_offset", null: false
    t.index ["source_id"], name: "index_statement_transcript_positions_on_source_id"
    t.index ["statement_id"], name: "index_statement_transcript_positions_on_statement_id"
  end

  create_table "statements", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.text "content"
    t.datetime "excerpted_at"
    t.boolean "important"
    t.boolean "published"
    t.boolean "count_in_statistics"
    t.bigint "speaker_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "source_id"
    t.datetime "deleted_at"
    t.integer "source_order"
    t.index ["source_id"], name: "index_statements_on_source_id"
    t.index ["speaker_id"], name: "index_statements_on_speaker_id"
  end

  create_table "tags", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.boolean "is_policy_area"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.text "position_description"
    t.text "bio"
    t.string "email"
    t.string "phone"
    t.datetime "registered_at"
    t.integer "order"
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "rank"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.boolean "email_notifications", default: false
    t.boolean "user_public", default: false
  end

  create_table "users_roles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "veracities", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "key"
  end

end
