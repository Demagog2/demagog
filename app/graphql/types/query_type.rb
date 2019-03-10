# frozen_string_literal: true

Bootstrap = Struct.new(:image_server_url)

class Types::QueryType < GraphQL::Schema::Object
  description "The query root of this schema"

  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :bootstrap, Types::BootstrapType, null: false

  def bootstrap
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    Bootstrap.new(ENV["DEMAGOG_IMAGE_SERVICE_URL"] || "")
  end

  field :source, Types::SourceType, null: false do
    argument :id, Int, required: true
  end

  def source(id:)
    begin
      Source.find(id)
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new("Could not find Source with id=#{id}")
    end
  end

  field :sources, [Types::SourceType], null: false do
    argument :limit, Int, required: false, default_value: 10
    argument :offset, Int, required: false, default_value: 0
    argument :name, String, required: false
  end

  def sources(args)
    sources = Source
                .includes(:medium, :media_personalities)
                .order(released_at: :desc)
                .offset(args[:offset])
                .limit(args[:limit])

    if args[:name]
      sources.matching_name(args[:name])
    else
      sources
    end
  end

  field :media, [Types::MediumType], null: false do
    argument :name, String, required: false
  end

  def media(name:)
    media = Medium.order(name: :asc)

    if name
      media.matching_name(name)
    else
      media
    end
  end

  field :medium, Types::MediumType, null: false do
    argument :id, ID, required: true
  end

  def medium(id:)
    begin
      Medium.find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find Medium with id=#{args[:id]}")
    end
  end

  field :media_personalities, [Types::MediaPersonalityType], null: false do
    argument :name, String, required: false
  end

  def media_personalities(name:)
    media_personalities = MediaPersonality.order(name: :asc)

    if name
      media_personalities.matching_name(name)
    else
      media_personalities
    end
  end

  def media_personality(id:)
    begin
      MediaPersonality.find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find MediaPersonality with id=#{id}")
    end
  end

  field :speaker, Types::SpeakerType, null: false do
    argument :id, Int, required: true
  end

  def speaker(id:)
    begin
      Speaker.find(args[:id])
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find Speaker with id=#{id}")
    end
  end


  field :speakers, [Types::SpeakerType], null: false do
    argument :limit, Int, required: false, default_value: 10
    argument :offset, Int, required: false, default_value: 0
    argument :party, Int, required: false
    argument :body, Int, required: false
    argument :name, String, required: false
  end

  def speakers(args)
    speakers = Speaker
                 .offset(args[:offset])
                 .limit(args[:limit])
                 .order(last_name: :asc)

    body = args[:party] || args[:body]
    speakers = speakers.active_body_members(body) if body.present?

    name = args[:name]
    speakers = speakers.matching_name(name) if name.present?

    speakers
  end

  field :statement, Types::StatementType, null: false do
    argument :id, Int, required: true
    argument :include_unpublished, Boolean, required: false, default_value: false
  end

  def statement(args)
    begin
      if args[:include_unpublished]
        # Public cannot access unpublished statements
        raise Errors::AuthenticationNeededError.new unless context[:current_user]

        return Statement.find(args[:id])
      end

      Statement.published.find(args[:id])
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find Statement with id=#{args[:id]}")
    end
  end

  field :statements, [Types::StatementType], null: false do
    argument :limit, Int, required: false, default_value: 10
    argument :offset, Int, required: false, default_value: 0
    argument :source, Int, required: false
    argument :speaker, Int, required: false
    argument :veracity, Types::VeracityKeyType, required: false
    argument :include_unpublished, Boolean, required: false, default_value: false
  end

  def statements(args)
    if args[:include_unpublished]
      # Public cannot access unpublished statements
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      statements = Statement.ordered
    else
      statements = Statement.published
    end

    statements = statements.offset(args[:offset]).limit(args[:limit])

    statements = statements.where(source: args[:source]) if args[:source]
    statements = statements.where(speaker: args[:speaker]) if args[:speaker]
    statements = statements.joins(:veracities).where(veracities: { key: args[:veracity] }) if args[:veracity]

    statements
  end

  field :party, Types::PartyType, null: false, deprecation_reason: "Replaced by 'body', as not all speakers must be members of a political party" do
    argument :id, Int, required: true
  end

  def party(id:)
    Body.find(id)
  end

  field :body, Types::BodyType, null: false do
    argument :id, Int, required: true
  end

  def body(id:)
    begin
      Body.find(id)
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new("Could not find Body with id=#{id}")
    end
  end

  field :parties, [Types::PartyType], null: false, deprecation_reason: "Replaced by 'bodies', as not all speakers must be members a political party" do
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

  # field :veracities, !types[!Types::VeracityType] do
  #   resolve -> (obj, args, ctx) {
  #     Veracity.all
  #   }
  # end
  #
  # field :article, !Types::ArticleType do
  #   argument :id, types.ID
  #   argument :slug, types.String
  #   argument :include_unpublished, types.Boolean, default_value: false
  #
  #   resolve -> (obj, args, ctx) {
  #     begin
  #       if args[:include_unpublished]
  #         # Public cannot access unpublished articles
  #         raise Errors::AuthenticationNeededError.new unless ctx[:current_user]
  #
  #         return Article.friendly.find(args[:slug] || args[:id])
  #       end
  #
  #       Article.published.friendly.find(args[:slug] || args[:id])
  #     rescue ActiveRecord::RecordNotFound => e
  #       raise GraphQL::ExecutionError.new("Could not find Article with id=#{args[:id]} or slug=#{args[:slug]}")
  #     end
  #   }
  # end
  #
  # field :articles, !types[!Types::ArticleType] do
  #   argument :offset, types.Int, default_value: 0
  #   argument :limit, types.Int, default_value: 10
  #   argument :title, types.String
  #   argument :include_unpublished, types.Boolean, default_value: false
  #
  #   resolve -> (obj, args, ctx) {
  #     if args[:include_unpublished]
  #       # Public cannot access unpublished articles
  #       raise Errors::AuthenticationNeededError.new unless ctx[:current_user]
  #
  #       articles = Article.all
  #     else
  #       articles = Article.published
  #     end
  #
  #     articles = articles
  #       .includes(:article_type)
  #       .offset(args[:offset])
  #       .limit(args[:limit])
  #       .order("COALESCE(published_at, created_at) DESC")
  #
  #     articles = articles.matching_title(args[:title]) if args[:title].present?
  #
  #     articles
  #   }
  # end
  #
  # field :pages, !types[!Types::PageType] do
  #   argument :offset, types.Int, default_value: 0
  #   argument :limit, types.Int, default_value: 10
  #   argument :title, types.String
  #   argument :include_unpublished, types.Boolean, default_value: false
  #
  #   resolve -> (obj, args, ctx) {
  #     if args[:include_unpublished]
  #       # Public cannot access unpublished pages
  #       raise Errors::AuthenticationNeededError.new unless ctx[:current_user]
  #
  #       pages = Page.all
  #     else
  #       pages = Page.published
  #     end
  #
  #     pages = pages
  #                  .offset(args[:offset])
  #                  .limit(args[:limit])
  #                  .order(title: :asc)
  #
  #     pages = pages.matching_title(args[:title]) if args[:title].present?
  #
  #     pages
  #   }
  # end

  field :page, Types::PageType, null: false do
    argument :id, ID, required: false
    argument :slug, String, required: false
    argument :include_unpublished, Boolean, default_value: false, required: false
  end

  def page(args)
    begin
      if args[:include_unpublished]
        # Public cannot access unpublished articles
        raise Errors::AuthenticationNeededError.new unless context[:current_user]

        return Page.friendly.find(args[:slug] || args[:id])
      end

      Page.published.friendly.find(args[:slug] || args[:id])
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new("Could not find Page with id=#{args[:id]} or slug=#{args[:slug]}")
    end
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

  # field :notifications, !Types::NotificationsResult do
  #   argument :offset, types.Int, default_value: 0
  #   argument :limit, types.Int, default_value: 10
  #   argument :include_read, types.Boolean, default_value: false
  #
  #   resolve -> (obj, args, ctx) {
  #     raise Errors::AuthenticationNeededError.new unless ctx[:current_user]
  #
  #     current_user = ctx[:current_user]
  #     notifications = current_user.notifications
  #
  #     notifications = notifications.where(read_at: nil) unless args[:include_read]
  #
  #     {
  #       total_count: notifications.count,
  #       items: notifications
  #         .offset(args[:offset])
  #         .limit(args[:limit])
  #         .order(created_at: :desc)
  #     }
  #   }
  # end
  #
  field :users, [Types::UserType], null: false do
    argument :offset, Int, default_value: 0, required: false
    argument :limit, Int, default_value: 10, required: false
    argument :name, String, required: false
    argument :include_inactive, Boolean, default_value: false, required: false
    argument :roles, [String], required: false
  end

  def users(args)
    raise Errors::AuthenticationNeededError.new unless context[:current_user]

    users = User.kept
      .order(last_name: :asc, first_name: :asc)
      .limit(args[:limit])
      .offset(args[:offset])

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

  # ContentImagesResult = GraphQL::ObjectType.define do
  #   name "ContentImagesResult"
  #   field :total_count, !types.Int, hash_key: :total_count
  #   field :items, !types[!Types::ContentImageType], hash_key: :items
  # end
  #
  # field :content_images, !ContentImagesResult do
  #   argument :limit, types.Int, default_value: 10
  #   argument :offset, types.Int, default_value: 0
  #   argument :name, types.String, default_value: nil
  #
  #   resolve -> (obj, args, ctx) {
  #     raise Errors::AuthenticationNeededError.new unless ctx[:current_user]
  #
  #     content_images = ContentImage.all
  #
  #     content_images = content_images.matching_name(args[:name]) if args[:name].present?
  #
  #     {
  #       total_count: content_images.count,
  #       items: content_images
  #         .offset(args[:offset])
  #         .limit(args[:limit])
  #         .order(created_at: :desc)
  #     }
  #   }
  # end
end
