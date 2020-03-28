# frozen_string_literal: true

atom_feed(
  # Explicitly passing urls so they are correctly with https
  root_url: url_for(controller: "homepage", action: "index", only_path: false),
  url: url_for(controller: "rss", action: "index", format: "atom", only_path: false)
) do |feed|
  feed.title("Demagog.cz - Factcheck politických diskuzí")
  feed.updated(@articles[0].published_at) if @articles.length > 0

  @articles.each do |article|
    feed.entry(article, published: article.published_at, updated: article.published_at) do |entry|
      entry.title(article.title)

      if article.perex.present?
        entry.content(article.perex, type: "html")
      elsif article.article_type.name == "single_statement"
        entry.content("„" + article.single_statement.content.strip + "“ hodnotíme jako " + article.single_statement.approved_assessment.veracity.name.downcase + ".", type: "html")
      end

      entry.author do |author|
        author.name("Demagog.cz")
      end
    end
  end
end
