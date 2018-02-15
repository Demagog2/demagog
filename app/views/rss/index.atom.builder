# frozen_string_literal: true

atom_feed do |feed|
  feed.title("Demagog.cz - Factcheck politických diskuzí")
  feed.updated(@articles[0].created_at) if @articles.length > 0

  @articles.each do |post|
    feed.entry(post, updated: post.published_at) do |entry|
      entry.title(post.title)
      entry.content(post.perex, type: "html")
    end
  end
end
