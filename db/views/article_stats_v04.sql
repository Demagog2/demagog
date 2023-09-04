SELECT COUNT(veracity_new), veracity_new as "key", source_speakers.speaker_id, article_id
FROM statements
       JOIN source_speakers ON source_speakers.id = statements.source_speaker_id
       JOIN assessments ON statements.id = assessments.statement_id
       JOIN sources ON sources.id = statements.source_id
       JOIN article_segments ON article_segments.source_id = sources.id
       JOIN articles ON articles.id = article_segments.article_id
WHERE assessments.evaluation_status = 'approved'
  AND article_segments.segment_type = 'source_statements'
  AND statements.published = true
GROUP BY (veracity_new, source_speakers.speaker_id, article_id)
