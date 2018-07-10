# frozen_string_literal: true

require "ruby-progressbar/outputs/null"

require_relative "./helpers/image_url_helper"

class ArticleMigration
  attr_accessor :connection
  attr_accessor :quiet

  def initialize(connection, quiet)
    self.connection = connection
    self.quiet = quiet
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
      :created_at,
      :updated_at
    ]

    article_type = ArticleType.find_by(name: "default")

    Article.bulk_insert(*keys) do |worker|
      old_articles.each do |old_article|
        worker.add([
          old_article["id"],
          old_article["nazov"],
          old_article["uvod"],
          old_article["datum"],
          old_article["status"] == 1,
          old_article["id_user"],
          article_type.id,
          old_article["id"],
          Time.now,
          Time.now
        ])
      end
    end

    progressbar = ProgressBar.create(
      format: "Migrating article illustrations part #1: %e |%b>>%i| %p%% %t",
      total: old_articles.size,
      output: quiet ? ProgressBar::Outputs::Null : $stdout
    )

    old_articles.each do |old_article|
      unless old_article["obrazok"].empty?
        path = "/data/diskusia/s/#{old_article["obrazok"]}"
        article = Article.find(old_article["id"])

        ImageUrlHelper.open_image(path) do |file|
          article.illustration.attach io: file, filename: old_article["obrazok"]
        end
      end

      progressbar.increment
    end

    # Necessary to generate slugs
    # TODO: Replace by something more performant
    Article.find_each(&:save!)
  end

  def migrate_static_pages
    old_articles = self.connection.query("
      SELECT *
      FROM static_pages
    ")

    article_type = ArticleType.find_by(name: "static")

    old_articles.each do |old_article|
      article = Article.new(
        title: old_article["nazov"],
        slug: old_article["alias"],
        perex: old_article["excerpt"],
        published_at: old_article["timestamp"],
        published: old_article["status"] == 1,
        article_type: article_type,
        updated_at: old_article["timestamp"]
      )

      article.save!

      segment = Segment.create!(
        segment_type: "text",
        text_html: old_article["obsah"]
      )

      ArticleHasSegment.create!(
        segment: segment,
        article: article,
        order: 1
      )
    end

    progressbar = ProgressBar.create(
      format: "Migrating article illustrations part #2: %e |%b>>%i| %p%% %t",
      total: old_articles.size,
      output: quiet ? ProgressBar::Outputs::Null : $stdout
    )

    old_articles.each do |old_article|
      unless old_article["obrazok"].empty?
        path = "/data/pages/s/#{old_article["obrazok"]}"
        article = Article.find(old_article["id"])

        ImageUrlHelper.open_image(path) do |file|
          article.illustration.attach io: file, filename: old_article["obrazok"]
        end
      end

      progressbar.increment
    end
  end
end
