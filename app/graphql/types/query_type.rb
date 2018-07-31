# frozen_string_literal: true

Bootstrap = Struct.new(:image_server_url)

Types::QueryType = GraphQL::ObjectType.define do
  name "Query"
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :bootstrap, !Types::BootstrapType do
    resolve -> (obj, args, ctx) {
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      Bootstrap.new(ENV["DEMAGOG_IMAGE_SERVICE_URL"] || "")
    }
  end

  field :source, !Types::SourceType do
    argument :id, !types.Int

    resolve -> (obj, args, ctx) {
      begin
        Source.find(args[:id])
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new("Could not find Source with id=#{args[:id]}")
      end
    }
  end

  field :media, !types[!Types::MediumType] do
    argument :name, types.String

    resolve -> (obj, args, ctx) {
      media = Medium.order(name: :asc)

      media = media.matching_name(args[:name]) if args[:name]

      media
    }
  end

  field :medium, !Types::MediumType do
    argument :id, !types.ID

    resolve -> (obj, args, ctx) {
      begin
        Medium.find(args[:id])
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new("Could not find Medium with id=#{args[:id]}")
      end
    }
  end

  field :media_personalities, !types[!Types::MediaPersonalityType] do
    resolve -> (obj, args, ctx) {
      MediaPersonality.order(name: :asc)
    }
  end

  field :sources, !types[!Types::SourceType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0
    argument :name, types.String

    resolve -> (obj, args, ctx) {
      sources = Source
        .includes(:medium, :media_personality)
        .order(released_at: :desc)
        .offset(args[:offset])
        .limit(args[:limit])

      sources = sources.matching_name(args[:name]) if args[:name].present?

      sources
    }
  end

  field :speaker, !Types::SpeakerType do
    argument :id, !types.Int

    resolve -> (obj, args, ctx) {
      begin
        Speaker.find(args[:id])
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new("Could not find Speaker with id=#{args[:id]}")
      end
    }
  end

  field :speakers, !types[!Types::SpeakerType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0
    argument :party, types.Int
    argument :body, types.Int
    argument :name, types.String

    resolve -> (obj, args, ctx) {
      speakers = Speaker
        .offset(args[:offset])
        .limit(args[:limit])
        .order(last_name: :asc)

      body = args[:party] || args[:body]
      speakers = speakers.active_body_members(body) if body.present?

      name = args[:name]
      speakers = speakers.matching_name(name) if name.present?

      speakers
    }
  end

  field :statement, !Types::StatementType do
    argument :id, !types.Int
    argument :include_unpublished, types.Boolean, default_value: false

    resolve -> (obj, args, ctx) {
      begin
        if args[:include_unpublished]
          # Public cannot access unpublished statements
          raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

          return Statement.find(args[:id])
        end

        Statement.published.find(args[:id])
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new("Could not find Statement with id=#{args[:id]}")
      end
    }
  end

  field :statements, !types[!Types::StatementType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0
    argument :source, types.Int
    argument :speaker, types.Int
    argument :veracity, Types::VeracityKeyType
    argument :include_unpublished, types.Boolean, default_value: false

    resolve -> (obj, args, ctx) {
      if args[:include_unpublished]
        # Public cannot access unpublished statements
        raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

        statements = Statement.ordered
      else
        statements = Statement.published
      end

      statements = statements.offset(args[:offset]).limit(args[:limit])

      statements = statements.where(source: args[:source]) if args[:source]
      statements = statements.where(speaker: args[:speaker]) if args[:speaker]
      statements = statements.joins(:veracities).where(veracities: { key: args[:veracity] }) if args[:veracity]

      statements
    }
  end

  field :party, !Types::PartyType do
    argument :id, !types.Int

    deprecation_reason "Replaced by 'body', as not all speakers must be members of a political party"

    resolve -> (obj, args, ctx) {
      Body.find(args[:id])
    }
  end

  field :body, !Types::BodyType do
    argument :id, !types.Int

    resolve -> (obj, args, ctx) {
      begin
        Body.find(args[:id])
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new("Could not find Body with id=#{args[:id]}")
      end
    }
  end

  field :parties, types[Types::PartyType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0

    deprecation_reason "Replaced by 'bodies', as not all speakers must be members a political party"

    resolve -> (obj, args, ctx) {
      Body.offset(args[:offset]).limit(args[:limit])
    }
  end

  field :bodies, !types[!Types::BodyType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0
    argument :is_party, types.Boolean, default_value: nil
    argument :name, types.String, default_value: nil

    resolve -> (obj, args, ctx) {
      bodies = Body.offset(args[:offset]).limit(args[:limit]).order(name: :asc)

      bodies = bodies.where(is_party: args[:is_party]) unless args[:is_party].nil?

      bodies =
        bodies.where("name LIKE ? OR short_name LIKE ?", "%#{args[:name]}%", "%#{args[:name]}%") unless args[:name].nil?

      bodies
    }
  end

  field :veracities, !types[!Types::VeracityType] do
    resolve -> (obj, args, ctx) {
      Veracity.all
    }
  end

  field :article, !Types::ArticleType do
    argument :id, types.ID
    argument :slug, types.String
    argument :include_unpublished, types.Boolean, default_value: false

    resolve -> (obj, args, ctx) {
      begin
        if args[:include_unpublished]
          # Public cannot access unpublished articles
          raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

          return Article.friendly.find(args[:slug] || args[:id])
        end

        Article.published.friendly.find(args[:slug] || args[:id])
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new("Could not find Article with id=#{args[:id]} or slug=#{args[:slug]}")
      end
    }
  end

  field :articles, !types[!Types::ArticleType] do
    argument :offset, types.Int, default_value: 0
    argument :limit, types.Int, default_value: 10
    argument :order, types.String, default_value: "desc"
    argument :title, types.String
    argument :include_unpublished, types.Boolean, default_value: false

    resolve -> (obj, args, ctx) {
      if args[:include_unpublished]
        # Public cannot access unpublished articles
        raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

        articles = Article.all
      else
        articles = Article.published
      end

      articles = articles
        .includes(:article_type)
        .offset(args[:offset])
        .limit(args[:limit])
        .order(created_at: args[:order])

      articles = articles.matching_title(args[:title]) if args[:title].present?

      articles
    }
  end

  field :pages, !types[!Types::PageType] do
    argument :offset, types.Int, default_value: 0
    argument :limit, types.Int, default_value: 10
    argument :title, types.String
    argument :include_unpublished, types.Boolean, default_value: false

    resolve -> (obj, args, ctx) {
      if args[:include_unpublished]
        # Public cannot access unpublished pages
        raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

        pages = Page.all
      else
        pages = Page.published
      end

      pages = pages
                   .offset(args[:offset])
                   .limit(args[:limit])
                   .order(title: :asc)

      pages = pages.matching_title(args[:title]) if args[:title].present?

      pages
    }
  end

  field :page, !Types::PageType do
    argument :id, types.ID
    argument :slug, types.String
    argument :include_unpublished, types.Boolean, default_value: false

    resolve -> (obj, args, ctx) {
      begin
        if args[:include_unpublished]
          # Public cannot access unpublished articles
          raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

          return Page.friendly.find(args[:slug] || args[:id])
        end

        Page.published.friendly.find(args[:slug] || args[:id])
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new("Could not find Page with id=#{args[:id]} or slug=#{args[:slug]}")
      end
    }
  end

  field :user, !Types::UserType do
    argument :id, !types.Int

    resolve -> (obj, args, ctx) {
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      begin
        User.find(args[:id])
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new("Could not find User with id=#{args[:id]}")
      end
    }
  end

  field :current_user, !Types::UserType do
    resolve -> (obj, args, ctx) {
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      ctx[:current_user]
    }
  end

  NotificationsResult = GraphQL::ObjectType.define do
    name "NotificationsResult"
    field :total_count, !types.Int, hash_key: :total_count
    field :items, !types[!Types::NotificationType], hash_key: :items
  end

  field :notifications, !NotificationsResult do
    argument :offset, types.Int, default_value: 0
    argument :limit, types.Int, default_value: 10
    argument :include_read, types.Boolean, default_value: false

    resolve -> (obj, args, ctx) {
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      current_user = ctx[:current_user]
      notifications = current_user.notifications

      notifications = notifications.where(read_at: nil) unless args[:include_read]

      {
        total_count: notifications.count,
        items: notifications
          .offset(args[:offset])
          .limit(args[:limit])
          .order(created_at: :desc)
      }
    }
  end

  field :users, !types[!Types::UserType] do
    argument :offset, types.Int, default_value: 0
    argument :limit, types.Int, default_value: 10
    argument :name, types.String
    argument :include_inactive, types.Boolean, default_value: false
    argument :roles, types[!types.String]

    resolve -> (obj, args, ctx) {
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      users = User
        .limit(args[:limit])
        .offset(args[:offset])
        .order(last_name: :asc, first_name: :asc)

      users = users.where(active: true) unless args[:include_inactive]

      users = users.joins(:roles).where(roles: { key: args[:roles] }) if args[:roles]

      users =
        users.where("first_name LIKE ? OR last_name LIKE ?", "%#{args[:name]}%", "%#{args[:name]}%") unless args[:name].nil?

      users
    }
  end

  field :roles, !types[!Types::RoleType] do
    resolve -> (obj, args, ctx) {
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      Role.all
    }
  end

  ContentImagesResult = GraphQL::ObjectType.define do
    name "ContentImagesResult"
    field :total_count, !types.Int, hash_key: :total_count
    field :items, !types[!Types::ContentImageType], hash_key: :items
  end

  field :content_images, !ContentImagesResult do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0
    argument :name, types.String, default_value: nil

    resolve -> (obj, args, ctx) {
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      content_images = ContentImage.all

      content_images = content_images.matching_name(args[:name]) if args[:name].present?

      {
        total_count: content_images.count,
        items: content_images
          .offset(args[:offset])
          .limit(args[:limit])
          .order(created_at: :desc)
      }
    }
  end
end
