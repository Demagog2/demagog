SELECT COUNT(veracities.key), veracities.key, speaker_id, article_id
FROM statements
       JOIN speakers ON speakers.id = statements.speaker_id
       JOIN assessments ON statements.id = assessments.statement_id
       JOIN veracities ON assessments.veracity_id = veracities.id
       JOIN sources ON sources.id = statements.source_id
       JOIN article_segments ON article_segments.source_id = sources.id
       JOIN articles ON articles.id = article_segments.article_id
WHERE assessments.evaluation_status = 'approved'
  AND article_segments.segment_type = 'source_statements'
  AND statements.published = true
GROUP BY (veracities.key, speaker_id, article_id)
