# frozen_string_literal: true

Types::QueryType = GraphQL::ObjectType.define do
  name "Query"
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :speaker, Types::SpeakerType do
    argument :id, !types.Int

    resolve -> (obj, args, ctx) {
      Speaker.find(args[:id])
    }
  end

  field :speakers, types[Types::SpeakerType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0
    argument :party, types.Int
    argument :body, types.Int

    resolve -> (obj, args, ctx) {
      speakers = Speaker.offset(args[:offset]).limit(args[:limit])

      if args[:party] || args[:body]
        speakers
          .joins(:memberships)
          .where(memberships: {
            body_id: args[:party] || args[:body],
            until: nil
          })
      else
        speakers
      end
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

  field :party, Types::PartyType do
    argument :id, !types.Int

    deprecation_reason "Replaced by 'body', as not all speakers must be members of a political party"

    resolve -> (obj, args, ctx) {
      Body.find(args[:id])
    }
  end

  field :body, Types::BodyType do
    argument :id, !types.Int

    resolve -> (obj, args, ctx) {
      Body.find(args[:id])
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

  field :bodies, types[Types::BodyType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0
    argument :is_party, types.Boolean, default_value: nil

    resolve -> (obj, args, ctx) {
      bodies = Body.offset(args[:offset]).limit(args[:limit])

      bodies = bodies.where(is_party: args[:is_party]) unless args[:is_party].nil?

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
end
