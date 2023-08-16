SELECT COUNT(veracity_new), veracity_new AS "key", source_speakers.speaker_id
FROM statements
       JOIN source_speakers ON source_speakers.id = statements.source_speaker_id
       JOIN assessments ON statements.id = assessments.statement_id
WHERE assessments.evaluation_status = 'approved'
  AND statements.published = true
  AND statements.statement_type = 'factual'
GROUP BY (veracity_new, source_speakers.speaker_id)
