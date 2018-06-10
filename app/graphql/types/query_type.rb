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
      rescue ActiveRecord::RecordNotFound => err
        nil
      end
    }
  end

  field :media, !types[!Types::MediumType] do
    resolve -> (obj, args, ctx) {
      Medium.order(name: :asc)
    }
  end

  field :medium, !Types::MediumType do
    argument :id, !types.Int

    resolve -> (obj, args, ctx) {
      begin
        Medium.find(args[:id])
      rescue ActiveRecord::RecordNotFound => err
        nil
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
        .offset(args[:offset])
        .limit(args[:limit])
        .order(created_at: :desc)

      sources = sources.matching_name(args[:name]) if args[:name].present?

      sources
    }
  end

  field :speaker, !Types::SpeakerType do
    argument :id, !types.Int

    resolve -> (obj, args, ctx) {
      begin
        Speaker.find(args[:id])
      rescue ActiveRecord::RecordNotFound => err
        nil
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

  field :statement, Types::StatementType do
    argument :id, !types.Int

    resolve -> (obj, args, ctx) {
      Statement.where(published: true).find(args[:id])
    }
  end

  field :statements, types[Types::StatementType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0
    argument :speaker, types.Int
    argument :veracity, Types::VeracityKeyType

    resolve -> (obj, args, ctx) {
      statements = Statement.offset(args[:offset]).limit(args[:limit])

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
      rescue ActiveRecord::RecordNotFound => err
        nil
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

  field :veracities, types[Types::VeracityType] do
    resolve -> (obj, args, ctx) {
      Veracity.all
    }
  end

  field :article, Types::ArticleType do
    argument :slug, !types.String

    resolve -> (obj, args, ctx) {
      Article.where(published: true).friendly.find(args[:slug])
    }
  end

  field :articles, types[Types::ArticleType] do
    argument :offset, types.Int, default_value: 0
    argument :limit, types.Int, default_value: 10
    argument :article_type, types.String, default_value: "default"
    argument :order, types.String, default_value: "desc"

    resolve -> (obj, args, ctx) {
      Article
        .joins(:article_type)
        .where(published: true, article_types: { name: args[:article_type] })
        .offset(args[:offset])
        .limit(args[:limit])
        .order(published_at: args[:order])
    }
  end

  field :user, !Types::UserType do
    argument :id, !types.Int

    resolve -> (obj, args, ctx) {
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      User.find(args[:id])
    }
  end

  field :users, !types[!Types::UserType] do
    argument :offset, types.Int, default_value: 0
    argument :limit, types.Int, default_value: 10
    argument :name, types.String
    argument :include_inactive, types.Boolean, default_value: false

    resolve -> (obj, args, ctx) {
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      users = User.limit(args[:limit]).offset(args[:offset])

      users = users.where(active: true) unless args[:include_inactive]

      users =
        users.where("first_name LIKE ? OR last_name LIKE ?", "%#{args[:name]}%", "%#{args[:name]}%") unless args[:name].nil?

      users
    }
  end
end
