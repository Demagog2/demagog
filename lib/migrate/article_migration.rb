# frozen_string_literal: true

class EmptyIllustration
  def id
    nil
  end
end

class ArticleMigration
  attr_accessor :connection

  def initialize(connection)
    self.connection = connection
  end

  def perform
    migrate_discussions
    migrate_static_pages
  end

  def migrate_discussions
    old_articles = self.connection.query("
      SELECT id, uvod, nazov, obrazok, id_user, status, rubrika, datum
      FROM diskusia
      ORDER BY id DESC
    ")

    keys = [
      :id,
      :title,
      :perex,
      :published_at,
      :published,
      :user_id,
      :article_type_id,
      :source_id,
      :illustration_id,
      :created_at,
      :updated_at
    ]

    article_type = ArticleType.find_by(name: "default")

    Article.bulk_insert(*keys) do |worker|
      old_articles.each do |old_article|
        illustration = EmptyIllustration.new

        if old_article["obrazok"] != ""
          illustration = Attachment.create(
            file: old_article["obrazok"],
            attachment_type: Attachment::TYPE_ARTICLE_ILLUSTRATION
          )
        end

        worker.add([
          old_article["id"],
          old_article["nazov"],
          old_article["uvod"],
          old_article["datum"],
          old_article["status"] == 1,
          old_article["id_user"],
          article_type.id,
          old_article["id"],
          illustration.id,
          Time.now,
          Time.now
        ])
      end
    end

    # Necessary to generate slugs
    # TODO: Replace by something more performant
    Article.find_each(&:save!)
  end

  def migrate_static_pages
    ActiveRecord::Base.connection.reset_pk_sequence!("articles")

    old_articles = self.connection.query("
      SELECT *
      FROM static_pages
    ")

    article_type = ArticleType.find_by(name: "static")

    old_articles.each do |old_article|
      illustration = EmptyIllustration.new

      if old_article["obrazok"]
        illustration = Attachment.create(
          file: old_article["obrazok"],
          attachment_type: Attachment::TYPE_ARTICLE_ILLUSTRATION
        )
      end

      article = Article.new(
        title: old_article["nazov"],
        slug: old_article["alias"],
        perex: old_article["excerpt"],
        published_at: old_article["timestamp"],
        published: old_article["status"] == 1,
        article_type: article_type,
        illustration: illustration,
        updated_at: old_article["timestamp"]
      )

      article.save!

      segment = Segment.create!(
        segment_type: "text",
        text: old_article["obsah"]
      )

      ArticleHasSegment.create!(
        segment: segment,
        article: article,
        order: 1
      )
    end
  end
end
