# frozen_string_literal: true

Bootstrap = Struct.new(:image_server_url)

class Types::QueryType < GraphQL::Schema::Object
  description "The query root of this schema"

  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  include Schema::Sources::SourceField
  include Schema::Sources::SourcesField

  field :bootstrap, Types::BootstrapType, null: false

  def bootstrap
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    Bootstrap.new(ENV["DEMAGOG_IMAGE_SERVICE_URL"] || "")
  end

  field :media, [Types::MediumType], null: false do
    argument :name, String, required: false
  end

  def media(name:)
    media = Medium.order(name: :asc)

    name ? media.matching_name(name) : media
  end

  field :medium, Types::MediumType, null: false do
    argument :id, ID, required: true
  end

  def medium(id:)
    Medium.find(id)
  rescue ActiveRecord::RecordNotFound
    raise GraphQL::ExecutionError.new("Could not find Medium with id=#{args[:id]}")
  end

  field :media_personalities, [Types::MediaPersonalityType], null: false do
    argument :name, String, required: false
  end

  def media_personalities(**args)
    media_personalities = MediaPersonality.order(name: :asc)

    args[:name] ? media_personalities.matching_name(args[:name]) : media_personalities
  end

  field :media_personality, Types::MediaPersonalityType, null: false do
    argument :id, ID, required: true
  end

  def media_personality(id:)
    MediaPersonality.find(id)
  rescue ActiveRecord::RecordNotFound
    raise GraphQL::ExecutionError.new("Could not find MediaPersonality with id=#{id}")
  end

  field :speaker, Types::SpeakerType, null: false do
    argument :id, Int, required: true
  end

  def speaker(id:)
    Speaker.find(id)
  rescue ActiveRecord::RecordNotFound
    raise GraphQL::ExecutionError.new("Could not find Speaker with id=#{id}")
  end

  field :speakers, [Types::SpeakerType], null: false do
    argument :limit, Int, required: false, default_value: 10
    argument :offset, Int, required: false, default_value: 0
    argument :party, Int, required: false
    argument :body, Int, required: false
    argument :name, String, required: false
    argument :osoba_id,
             String,
             required: false,
             description: "Temporary IDs from Hlidac statu, please use Wikidata ID instead"
    argument :wikidata_id, String, required: false
  end

  def speakers(args)
    speakers = Speaker.offset(args[:offset]).limit(args[:limit]).order(last_name: :asc)

    body = args[:party] || args[:body]
    speakers = speakers.active_body_members(body) if body.present?

    name = args[:name]
    speakers = speakers.matching_name(name) if name.present?

    osoba_id = args[:osoba_id]
    speakers = speakers.where(osoba_id: osoba_id) if osoba_id.present?

    wikidata_id = args[:wikidata_id]
    speakers = speakers.where(wikidata_id: wikidata_id) if wikidata_id.present?

    speakers
  end

  field :government, Types::GovernmentType, null: true do
    argument :id, Int, required: true
  end

  def government(args)
    Government.find(args[:id])
  end

  field :statement, Types::StatementType, null: false do
    argument :id, Int, required: true
    argument :include_unpublished, Boolean, required: false, default_value: false
  end

  def statement(args)
    if args[:include_unpublished]
      # Public cannot access unpublished statements
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      return Statement.find(args[:id])
    end

    Statement.published.find(args[:id])
  rescue ActiveRecord::RecordNotFound
    raise GraphQL::ExecutionError.new("Could not find Statement with id=#{args[:id]}")
  end

  field :statements, [Types::StatementType], null: false do
    argument :limit, Int, required: false, default_value: 10
    argument :offset, Int, required: false, default_value: 0
    argument :source, Int, required: false
    argument :speaker, Int, required: false
    argument :veracity, Types::VeracityKeyType, required: false
    argument :include_unpublished, Boolean, required: false, default_value: false
    argument :evaluated_by_user_id, ID, required: false
    argument :sort_sources_in_reverse_chronological_order, Boolean, required: false, default_value: false
  end

  def statements(args)
    if args[:include_unpublished]
      # Public cannot access unpublished statements
      Utils::Auth.authenticate(context)

      statements = Statement.ordered
    else
      statements = Statement.published
    end

    statements = statements.offset(args[:offset]).limit(args[:limit])

    statements = statements.where(source: args[:source]) if args[:source]
    statements = statements.joins(:source_speaker).where(source_speaker: { speaker: args[:speaker] }) if args[:speaker]
    if args[:veracity]
      statements = statements.joins(:veracity).where(veracities: { key: args[:veracity] })
    end

    if args[:evaluated_by_user_id]
      # Public cannot filter by evaluator
      Utils::Auth.authenticate(context)

      statements = statements.joins(:assessment).where(assessments: { user_id: args[:evaluated_by_user_id] })
    end

    # Include these basics as they are part of most of queries for statements
    # and seriously speed those queries
    #
    # TODO: When we have graphql-ruby 1.9+, lets use lookaheads for smart includes.
    # See https://graphql-ruby.org/queries/lookahead.html
    statements =
      statements.includes({ assessment: :veracity }, { speaker: :body }, { source: :medium })

    if args[:sort_sources_in_reverse_chronological_order]
      statements = Statement.sort_statements_query(statements.reorder(""), false)
    end

    statements
  end

  field :party,
        Types::PartyType,
        null: false,
        deprecation_reason:
          "Replaced by 'body', as not all speakers must be members of a political party" do
    argument :id, Int, required: true
  end

  def party(id:)
    Body.find(id)
  end

  field :body, Types::BodyType, null: false do
    argument :id, Int, required: true
  end

  def body(id:)
    Body.find(id)
  rescue ActiveRecord::RecordNotFound
    raise GraphQL::ExecutionError.new("Could not find Body with id=#{id}")
  end

  field :parties,
        [Types::PartyType],
        null: false,
        deprecation_reason:
          "Replaced by 'bodies', as not all speakers must be members a political party" do
    argument :limit, Int, required: false, default_value: 10
    argument :offset, Int, required: false, default_value: 0
  end

  def parties(args)
    Body.offset(args[:offset]).limit(args[:limit])
  end

  field :bodies, [Types::BodyType], null: false do
    argument :limit, Int, required: false, default_value: 10
    argument :offset, Int, required: false, default_value: 0
    argument :is_party, Boolean, required: false, default_value: nil
    argument :name, String, required: false, default_value: nil
  end

  def bodies(args)
    bodies = Body.offset(args[:offset]).limit(args[:limit]).order(name: :asc)

    bodies = bodies.where(is_party: args[:is_party]) unless args[:is_party].nil?

    bodies = bodies.matching_name(args[:name]) if args[:name].present?

    bodies
  end

  field :veracities, [Types::VeracityType], null: false

  def veracities
    Veracity.all
  end

  field :promise_ratings, [Types::PromiseRatingType], null: false

  def promise_ratings
    PromiseRating.all
  end

  field :tags, [Types::TagType], null: false do
    argument :limit, Int, required: false, default_value: 10
    argument :offset, Int, required: false, default_value: 0
    argument :for_statement_type, Types::StatementTypeType, required: false, default_value: nil
  end

  def tags(args)
    tags = Tag.offset(args[:offset]).limit(args[:limit]).order(name: :asc)

    unless args[:for_statement_type].nil?
      tags = tags.where(for_statement_type: args[:for_statement_type])
    end

    tags
  end

  field :article, Types::ArticleType, null: false do
    argument :id, ID, required: false
    argument :slug, String, required: false
    argument :include_unpublished, Boolean, default_value: false, required: false
  end

  def article(args)
    if args[:include_unpublished]
      # Public cannot access unpublished articles
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      return Article.kept.friendly.find(args[:slug] || args[:id])
    end

    Article.kept.published.friendly.find(args[:slug] || args[:id])
  rescue ActiveRecord::RecordNotFound
    raise GraphQL::ExecutionError.new(
      "Could not find Article with id=#{args[:id]} or slug=#{args[:slug]}"
    )
  end

  field :articles, [Types::ArticleType], null: false do
    argument :offset, Int, default_value: 0, required: false
    argument :limit, Int, default_value: 10, required: false
    argument :title, String, required: false
    argument :include_unpublished, Boolean, default_value: false, required: false
  end

  def articles(args)
    if args[:include_unpublished]
      # Public cannot access unpublished articles
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      articles = Article.kept
    else
      articles = Article.kept.published
    end

    articles =
      articles.includes(:article_type).offset(args[:offset]).limit(args[:limit]).order(
        Arel.sql("COALESCE(published_at, created_at) DESC")
      )

    articles = articles.matching_title(args[:title]) if args[:title].present?

    articles
  end

  field :pages, [Types::PageType], null: false do
    argument :offset, Int, default_value: 0, required: false
    argument :limit, Int, default_value: 10, required: false
    argument :title, String, required: false
    argument :include_unpublished, Boolean, default_value: false, required: false
  end

  def pages(args)
    if args[:include_unpublished]
      # Public cannot access unpublished pages
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      pages = Page.kept
    else
      pages = Page.kept.published
    end

    pages = pages.offset(args[:offset]).limit(args[:limit]).order(title: :asc)

    pages = pages.matching_title(args[:title]) if args[:title].present?

    pages
  end

  field :page, Types::PageType, null: false do
    argument :id, ID, required: false
    argument :slug, String, required: false
    argument :include_unpublished, Boolean, default_value: false, required: false
  end

  def page(args)
    if args[:include_unpublished]
      # Public cannot access unpublished pages
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      return Page.friendly.find(args[:slug] || args[:id])
    end

    Page.published.friendly.find(args[:slug] || args[:id])
  rescue ActiveRecord::RecordNotFound
    raise GraphQL::ExecutionError.new(
      "Could not find Page with id=#{args[:id]} or slug=#{args[:slug]}"
    )
  end

  field :user, Types::UserType, null: false do
    argument :id, Int, required: false
  end

  def user(id:)
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    begin
      User.kept.find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find User with id=#{id}")
    end
  end

  field :current_user, Types::UserType, null: false

  def current_user
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    context[:current_user]
  end

  field :notifications, Types::NotificationsResultType, null: false do
    argument :offset, Int, default_value: 0, required: false
    argument :limit, Int, default_value: 10, required: false
    argument :include_read, Boolean, default_value: false, required: false
  end

  def notifications(args)
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    notifications = Notification.get(context[:current_user], args[:include_read])

    {
      total_count: notifications.count,
      items: notifications.offset(args[:offset]).limit(args[:limit]).order(created_at: :desc)
    }
  end

  field :users, [Types::UserType], null: false do
    argument :offset, Int, default_value: 0, required: false
    argument :limit, Int, default_value: 10, required: false
    argument :name, String, required: false
    argument :include_inactive, Boolean, default_value: false, required: false
    argument :roles, [String], required: false
  end

  def users(args)
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    users =
      User.kept.order(last_name: :asc, first_name: :asc).limit(args[:limit]).offset(args[:offset])

    users = users.where(active: true) unless args[:include_inactive]

    users = users.joins(:roles).where(roles: { key: args[:roles] }) if args[:roles]

    users = users.matching_name(args[:name]) if args[:name].present?

    users
  end

  field :roles, [Types::RoleType], null: false

  def roles
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    Role.all
  end

  field :content_images, Types::ContentImagesResultType, null: false do
    argument :limit, Int, default_value: 10, required: false
    argument :offset, Int, default_value: 0, required: false
    argument :name, String, default_value: nil, required: false
  end

  def content_images(args)
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    content_images = ContentImage.kept

    content_images = content_images.matching_name(args[:name]) if args[:name].present?

    {
      total_count: content_images.count,
      items: content_images.offset(args[:offset]).limit(args[:limit]).order(created_at: :desc)
    }
  end

  field :internal_overall_stats, Types::InternalOverallStatsType, null: false

  def internal_overall_stats
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    {
      factual_and_published_statements_count: Statement.factual_and_published.count,
      speakers_with_factual_and_published_statements_count: Speaker.with_factual_and_published_statements.count
    }
  end

  field :web_contents, [Types::WebContentType], null: false

  def web_contents
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    WebContent.all.order(name: :asc)
  end

  field :web_content, Types::WebContentType, null: false do
    argument :id, ID, required: true
  end

  def web_content(args)
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    WebContent.find(args[:id])
  rescue ActiveRecord::RecordNotFound
    raise GraphQL::ExecutionError.new("Could not find WebContent with id=#{args[:id]}")
  end
end
