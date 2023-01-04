# frozen_string_literal: true

require "ruby-progressbar/outputs/null"
require "time"

require_relative "./helpers/html_content_helper"
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
    migrate_images_in_text_segments
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
          old_article["datum"],
          old_article["datum"]
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
    # parent=31 is "Komentare a #vyrokdne", which is parent which legacy used for
    # all or non-factchecking articles
    old_articles = self.connection.query("
      SELECT *
      FROM static_pages
      WHERE parent = 31
    ")

    article_type_static = ArticleType.find_by(name: "static")

    old_articles.each do |old_article|
      article = Article.unscoped.new(
        title: old_article["nazov"],
        slug: old_article["alias"],
        perex: old_article["excerpt"],
        published_at: old_article["timestamp"],
        published: old_article["status"] == 1,
        article_type: article_type_static,
        created_at: old_article["timestamp"],
        updated_at: old_article["timestamp"]
      )

      article.segments << Segment.create!(
        segment_type: "text",
        text_html: HtmlContentHelper.to_clean_html(old_article["obsah"]),
        created_at: old_article["timestamp"],
        updated_at: old_article["timestamp"]
      )

      article.save!
    end

    progressbar = ProgressBar.create(
      format: "Migrating article illustrations part #2: %e |%b>>%i| %p%% %t",
      total: old_articles.size,
      output: quiet ? ProgressBar::Outputs::Null : $stdout
    )

    old_articles.each do |old_article|
      unless old_article["obrazok"].empty?
        path = "/data/pages/s/#{old_article["obrazok"]}"
        article = Article.find_by(slug: old_article["alias"])

        ImageUrlHelper.open_image(path) do |file|
          article.illustration.attach io: file, filename: old_article["obrazok"]
        end
      end

      progressbar.increment
    end
  end

  def migrate_images_in_text_segments
    segments = Segment.where(segment_type: Segment::TYPE_TEXT)

    progressbar = ProgressBar.create(
      format: "Migrating article text segment content images: %e |%b>>%i| %p%% %t",
      total: segments.size,
      output: quiet ? ProgressBar::Outputs::Null : $stdout
    )

    segments.each do |segment|
      img_src_matches = segment.text_html.scan(/<img[^>]*src="([^"]+)"[^>]*>/)

      img_src_matches.each do |img_src_match|
        src = img_src_match[0]

        is_demagog_upload_image = src.starts_with?("/data/images/") ||
          src.starts_with?("http://demagog.cz/data/images/") ||
          src.starts_with?("http://legacy.demagog.cz/data/images/")

        next unless is_demagog_upload_image

        path = src[/\/data\/images\/.*$/]
        filename = path.match(/\/data\/images\/(.*)/)[1]

        content_image = ContentImage.create!(created_at: segment.created_at)

        ImageUrlHelper.open_image(path) do |file|
          content_image.image.attach io: file, filename:
        end

        # Using polymorphic_url as it is the same as url_for, but allows
        # generating only the path of url without host. Not using
        # rails_blob_path, because url_for generates the permanent link
        # decoupled from where the file actually is.
        # See http://edgeguides.rubyonrails.org/active_storage_overview.html#linking-to-files
        src_new = Rails.application.routes.url_helpers.polymorphic_url(content_image.image, only_path: true)

        segment.text_html = segment.text_html.gsub(src, src_new)
      end

      segment.save!
      progressbar.increment
    end
  end
end
