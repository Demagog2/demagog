# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_03_05_082449) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "unaccent"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "article_type", ["default", "static", "single_statement", "facebook_factcheck", "government_promises_evaluation"]
  create_enum "veracity", ["true", "untrue", "misleading", "unverifiable"]

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", precision: nil, null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "article_segments", force: :cascade do |t|
    t.string "segment_type"
    t.text "text_html"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.text "text_slatejson"
    t.bigint "source_id"
    t.bigint "article_id"
    t.integer "order"
    t.string "promise_url"
    t.string "statement_id"
    t.index ["article_id"], name: "index_article_segments_on_article_id"
  end

  create_table "article_tag_articles", force: :cascade do |t|
    t.bigint "article_tag_id"
    t.bigint "article_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_article_tag_articles_on_article_id"
    t.index ["article_tag_id"], name: "index_article_tag_articles_on_article_tag_id"
  end

  create_table "article_tag_speakers", force: :cascade do |t|
    t.bigint "article_tag_id"
    t.bigint "speaker_id"
    t.integer "order", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_tag_id"], name: "index_article_tag_speakers_on_article_tag_id"
    t.index ["speaker_id"], name: "index_article_tag_speakers_on_speaker_id"
  end

  create_table "article_tag_statements", force: :cascade do |t|
    t.bigint "article_tag_id", null: false
    t.bigint "statement_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_tag_id"], name: "index_article_tag_statements_on_article_tag_id"
    t.index ["statement_id"], name: "index_article_tag_statements_on_statement_id"
  end

  create_table "article_tags", force: :cascade do |t|
    t.string "title"
    t.string "slug"
    t.text "description"
    t.integer "icon", default: 0
    t.bigint "medium_id"
    t.string "video"
    t.integer "stats", default: 0
    t.boolean "published"
    t.datetime "published_at"
    t.integer "order", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["medium_id"], name: "index_article_tags_on_medium_id"
  end

  create_table "articles", force: :cascade do |t|
    t.string "title"
    t.string "slug"
    t.text "perex"
    t.datetime "published_at", precision: nil
    t.boolean "published"
    t.bigint "user_id"
    t.integer "illustration_id"
    t.integer "document_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.datetime "deleted_at", precision: nil
    t.enum "article_type", default: "default", enum_type: "article_type"
    t.bigint "assessment_methodology_id"
    t.string "title_en"
    t.string "efcsn_external_id"
    t.datetime "efcsn_created_at"
    t.datetime "efcsn_updated_at"
    t.index ["assessment_methodology_id"], name: "index_articles_on_assessment_methodology_id"
    t.index ["document_id"], name: "index_articles_on_document_id"
    t.index ["illustration_id"], name: "index_articles_on_illustration_id"
    t.index ["user_id"], name: "index_articles_on_user_id"
  end

  create_table "articles_tags", id: false, force: :cascade do |t|
    t.bigint "tag_id"
    t.bigint "article_id"
    t.index ["article_id"], name: "index_articles_tags_on_article_id"
    t.index ["tag_id"], name: "index_articles_tags_on_tag_id"
  end

  create_table "assessment_methodologies", force: :cascade do |t|
    t.string "name", null: false
    t.string "url"
    t.string "rating_model", null: false
    t.json "rating_keys", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "assessments", force: :cascade do |t|
    t.text "explanation_html"
    t.string "evaluation_status"
    t.datetime "evaluated_at", precision: nil
    t.bigint "veracity_id"
    t.bigint "user_id"
    t.bigint "statement_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.text "explanation_slatejson"
    t.text "short_explanation"
    t.bigint "assessment_methodology_id", null: false
    t.bigint "promise_rating_id"
    t.datetime "evaluator_first_assigned_at", precision: nil
    t.datetime "first_requested_approval_at", precision: nil
    t.datetime "first_requested_proofreading_at", precision: nil
    t.datetime "first_approved_at", precision: nil
    t.datetime "evaluation_started_at", precision: nil
    t.datetime "evaluation_ended_at", precision: nil
    t.enum "veracity_new", enum_type: "veracity"
    t.index ["assessment_methodology_id"], name: "index_assessments_on_assessment_methodology_id"
    t.index ["promise_rating_id"], name: "index_assessments_on_promise_rating_id"
    t.index ["statement_id"], name: "index_assessments_on_statement_id"
    t.index ["user_id"], name: "index_assessments_on_user_id"
    t.index ["veracity_id"], name: "index_assessments_on_veracity_id"
  end

  create_table "attachments", force: :cascade do |t|
    t.string "attachment_type"
    t.string "file"
    t.text "description"
    t.string "source_url"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "bodies", force: :cascade do |t|
    t.string "name"
    t.string "short_name"
    t.string "description"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "attachment_id"
    t.boolean "is_party"
    t.boolean "is_inactive", default: false
    t.string "link"
    t.date "founded_at"
    t.date "terminated_at"
    t.index ["attachment_id"], name: "index_bodies_on_attachment_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "content", null: false
    t.bigint "user_id", null: false
    t.bigint "statement_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["statement_id"], name: "index_comments_on_statement_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "content_images", force: :cascade do |t|
    t.bigint "user_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "deleted_at", precision: nil
    t.index ["user_id"], name: "index_content_images_on_user_id"
  end

  create_table "flipper_features", force: :cascade do |t|
    t.string "key", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_flipper_features_on_key", unique: true
  end

  create_table "flipper_gates", force: :cascade do |t|
    t.string "feature_key", null: false
    t.string "key", null: false
    t.text "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feature_key", "key", "value"], name: "index_flipper_gates_on_feature_key_and_key_and_value", unique: true
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at", precision: nil
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id"
    t.index ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type"
  end

  create_table "governments", force: :cascade do |t|
    t.string "name"
    t.date "from"
    t.date "to"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "media", force: :cascade do |t|
    t.string "kind"
    t.string "name"
    t.text "description"
    t.bigint "attachment_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.datetime "deleted_at", precision: nil
    t.index ["attachment_id"], name: "index_media_on_attachment_id"
  end

  create_table "media_personalities", force: :cascade do |t|
    t.string "kind"
    t.string "name"
    t.text "description"
    t.bigint "attachment_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.datetime "deleted_at", precision: nil
    t.index ["attachment_id"], name: "index_media_personalities_on_attachment_id"
  end

  create_table "memberships", force: :cascade do |t|
    t.bigint "body_id"
    t.bigint "speaker_id"
    t.date "since"
    t.date "until"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["body_id"], name: "index_memberships_on_body_id"
    t.index ["speaker_id"], name: "index_memberships_on_speaker_id"
  end

  create_table "menu_items", force: :cascade do |t|
    t.string "title"
    t.string "kind", null: false
    t.bigint "page_id"
    t.integer "order", null: false
    t.datetime "created_at", precision: nil, null: false
    t.index ["page_id"], name: "index_menu_items_on_page_id"
  end

  create_table "ministers", force: :cascade do |t|
    t.integer "government_id"
    t.integer "speaker_id"
    t.integer "ordering"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notifications", force: :cascade do |t|
    t.text "full_text", null: false
    t.bigint "recipient_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "read_at", precision: nil
    t.datetime "emailed_at", precision: nil
    t.bigint "statement_id", null: false
    t.text "statement_text", null: false
    t.index ["recipient_id"], name: "index_notifications_on_recipient_id"
  end

  create_table "pages", force: :cascade do |t|
    t.string "title"
    t.string "slug"
    t.boolean "published"
    t.text "text_html"
    t.text "text_slatejson"
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "template"
  end

  create_table "promise_ratings", force: :cascade do |t|
    t.string "name", null: false
    t.string "key", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "public_api_accesses", force: :cascade do |t|
    t.string "ip"
    t.string "user_agent"
    t.string "query"
    t.json "variables"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "roles", force: :cascade do |t|
    t.string "key"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "name"
  end

  create_table "searched_queries", force: :cascade do |t|
    t.string "query", null: false
    t.string "result_type"
    t.json "result", null: false
    t.bigint "user_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["user_id"], name: "index_searched_queries_on_user_id"
  end

  create_table "source_speakers", force: :cascade do |t|
    t.bigint "source_id"
    t.bigint "speaker_id"
    t.string "first_name"
    t.string "last_name"
    t.integer "body_id"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["source_id"], name: "index_source_speakers_on_source_id"
    t.index ["speaker_id"], name: "index_source_speakers_on_speaker_id"
  end

  create_table "sources", force: :cascade do |t|
    t.text "transcript"
    t.string "source_url"
    t.date "released_at"
    t.bigint "medium_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "name", null: false
    t.datetime "deleted_at", precision: nil
    t.string "video_type"
    t.string "video_id"
    t.index ["medium_id"], name: "index_sources_on_medium_id"
  end

  create_table "sources_experts", id: false, force: :cascade do |t|
    t.bigint "source_id"
    t.bigint "user_id"
    t.index ["source_id"], name: "index_sources_experts_on_source_id"
    t.index ["user_id"], name: "index_sources_experts_on_user_id"
  end

  create_table "sources_media_personalities", id: false, force: :cascade do |t|
    t.bigint "source_id"
    t.bigint "media_personality_id"
    t.index ["media_personality_id"], name: "index_sources_media_personalities_on_media_personality_id"
    t.index ["source_id"], name: "index_sources_media_personalities_on_source_id"
  end

  create_table "speakers", force: :cascade do |t|
    t.string "before_name"
    t.string "first_name"
    t.string "last_name"
    t.string "after_name"
    t.text "bio"
    t.string "website_url"
    t.boolean "status"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "osoba_id"
    t.string "wikidata_id"
    t.string "role"
    t.index ["osoba_id"], name: "index_speakers_on_osoba_id"
    t.index ["wikidata_id"], name: "index_speakers_on_wikidata_id"
  end

  create_table "statement_transcript_positions", force: :cascade do |t|
    t.bigint "statement_id"
    t.bigint "source_id"
    t.integer "start_line", null: false
    t.integer "start_offset", null: false
    t.integer "end_line", null: false
    t.integer "end_offset", null: false
    t.index ["source_id"], name: "index_statement_transcript_positions_on_source_id"
    t.index ["statement_id"], name: "index_statement_transcript_positions_on_statement_id"
  end

  create_table "statement_video_marks", force: :cascade do |t|
    t.integer "start"
    t.integer "stop"
    t.integer "source_id"
    t.integer "statement_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "statements", force: :cascade do |t|
    t.text "content"
    t.datetime "excerpted_at", precision: nil
    t.boolean "important"
    t.boolean "published"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "source_id"
    t.datetime "deleted_at", precision: nil
    t.integer "source_order"
    t.string "statement_type", null: false
    t.string "title"
    t.integer "source_speaker_id"
    t.string "promise_source_url"
    t.string "promise_source_label"
    t.index ["source_id"], name: "index_statements_on_source_id"
    t.index ["source_speaker_id"], name: "index_statements_on_source_speaker_id"
  end

  create_table "statements_tags", id: false, force: :cascade do |t|
    t.bigint "statement_id"
    t.bigint "tag_id"
    t.index ["statement_id"], name: "index_statements_tags_on_statement_id"
    t.index ["tag_id"], name: "index_statements_tags_on_tag_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "for_statement_type", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.text "position_description"
    t.text "bio"
    t.string "email"
    t.string "phone"
    t.datetime "registered_at", precision: nil
    t.integer "order"
    t.boolean "active"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "rank"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.boolean "email_notifications", default: false
    t.boolean "user_public", default: false
    t.datetime "deleted_at", precision: nil
    t.boolean "notify_on_approval", default: false
    t.boolean "notify_on_statement_publish", default: false
  end

  create_table "users_roles", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "veracities", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "key"
  end

  create_table "versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.bigint "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.datetime "created_at", precision: nil
    t.text "object_changes"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  create_table "web_contents", force: :cascade do |t|
    t.string "system_id"
    t.string "name", null: false
    t.string "url_path"
    t.boolean "dynamic_page", default: false
    t.boolean "dynamic_page_published", default: false
    t.json "structure", default: "[]", null: false
    t.json "data", default: "{}", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "article_tag_statements", "article_tags"
  add_foreign_key "article_tag_statements", "statements"
  add_foreign_key "articles", "assessment_methodologies"

  create_view "article_stats", sql_definition: <<-SQL
      SELECT count(assessments.veracity_new) AS count,
      assessments.veracity_new AS key,
      source_speakers.speaker_id,
      article_segments.article_id
     FROM (((((statements
       JOIN source_speakers ON ((source_speakers.id = statements.source_speaker_id)))
       JOIN assessments ON ((statements.id = assessments.statement_id)))
       JOIN sources ON ((sources.id = statements.source_id)))
       JOIN article_segments ON ((article_segments.source_id = sources.id)))
       JOIN articles ON ((articles.id = article_segments.article_id)))
    WHERE (((assessments.evaluation_status)::text = 'approved'::text) AND ((article_segments.segment_type)::text = 'source_statements'::text) AND (statements.published = true))
    GROUP BY assessments.veracity_new, source_speakers.speaker_id, article_segments.article_id;
  SQL
  create_view "speaker_stats", sql_definition: <<-SQL
      SELECT count(assessments.veracity_new) AS count,
      assessments.veracity_new AS key,
      source_speakers.speaker_id
     FROM ((statements
       JOIN source_speakers ON ((source_speakers.id = statements.source_speaker_id)))
       JOIN assessments ON ((statements.id = assessments.statement_id)))
    WHERE (((assessments.evaluation_status)::text = 'approved'::text) AND (statements.published = true) AND ((statements.statement_type)::text = 'factual'::text))
    GROUP BY assessments.veracity_new, source_speakers.speaker_id;
  SQL
end
