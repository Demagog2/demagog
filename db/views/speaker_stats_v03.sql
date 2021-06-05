SELECT COUNT(veracities.key), veracities.key, speaker_id
FROM statements
       JOIN speakers ON speakers.id = statements.speaker_id
       JOIN assessments ON statements.id = assessments.statement_id
       JOIN veracities ON assessments.veracity_id = veracities.id
WHERE assessments.evaluation_status = 'approved'
  AND statements.published = true
  AND statements.statement_type = 'factual'
GROUP BY (veracities.key, speaker_id)
