# frozen_string_literal: true

class FixApprovedFactualStatementsWithoutVeracity < ActiveRecord::Migration[5.2]
  def up
    # These sources with their single statement should be just text articles
    [24, 25, 30, 36, 44].each do |source_id|
      source = Source.find(source_id)
      statement = source.statements[0]

      article_segment = source.article_segments[0]
      article = article_segment.article

      Article.update_article(article.id, {
        article_type: "static",
        segments: [{
          segment_type: ArticleSegment::TYPE_TEXT,
          text_html: statement.assessment.explanation_html,
          text_slatejson: nil
        }]
      })

      execute "DELETE FROM statements WHERE source_id = #{source.id}"
      execute "DELETE FROM sources WHERE id = #{source.id}"
    end

    # These sources with multiple statements should be just text articles
    [222, 233].each do |source_id|
      source = Source.find(source_id)

      article_segment = source.article_segments[0]
      article = article_segment.article

      text_html = ""
      source.statements.each do |statement|
        text_html += "<h2>#{statement.speaker.full_name}</h2>\n"
        text_html += "<p>#{statement.content}</p>\n"
        text_html += statement.assessment.explanation_html + "\n"
      end

      Article.update_article(article.id, {
        article_type: "static",
        segments: [{
          segment_type: ArticleSegment::TYPE_TEXT,
          text_html: text_html,
          text_slatejson: nil
        }]
      })

      execute "DELETE FROM statements WHERE source_id = #{source.id}"
      execute "DELETE FROM sources WHERE id = #{source.id}"
    end

    # These sources are with Zeman's promises (plus few other) and were used as to work on them,
    # so lets just switch the evaluation status to being evaluated and make sure they
    # are not published
    [313, 315, 316, 330, 347, 235, 256].each do |source_id|
      source = Source.find(source_id)

      source.statements.each do |statement|
        statement.published = false
        statement.save!

        statement.assessment.evaluation_status = Assessment::STATUS_BEING_EVALUATED
        statement.assessment.save!
      end
    end

    # Some statements are just missing the veracity, so move them to being evaluated status and make sure they are not published
    [5943, 5978, 11296, 11299, 11300, 11522, 11527, 12101, 13950, 13970, 15246, 16976].each do |statement_id|
      statement = Statement.find(statement_id)

      statement.published = false
      statement.save!

      statement.assessment.evaluation_status = Assessment::STATUS_BEING_EVALUATED
      statement.assessment.save!
    end

    # Remove artifical "Redakce Demagog.CZ" speaker, which is now not needed anymore
    execute "DELETE FROM statements WHERE speaker_id = 29"
    execute "DELETE FROM speakers WHERE id = 29"
  end

  def down
    # Not implemented
  end
end
