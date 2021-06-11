import { get, groupBy } from 'lodash';
import { ASSESSMENT_STATUS_APPROVED, ASSESSMENT_STATUS_PROOFREADING_NEEDED } from '../../constants';
import {
  AssessmentMethodologyRatingModel,
  GetSourceStatements as GetSourceStatementsQuery,
} from '../../operation-result-types';
import * as Sentry from '@sentry/browser';
import apolloClient from '../../apolloClient';
import { css } from 'emotion';
import { Colors } from '@blueprintjs/core';
import * as React from 'react';

interface ISpeakerStatsProps {
  speakers: { id: string; firstName: string; lastName: string }[];
  statements: GetSourceStatementsQuery['statements'];
}

export const SpeakersStats = (props: ISpeakerStatsProps) => {
  const assessmentMethodology = props.statements[0].assessment.assessmentMethodology;

  const statsBySpeaker = props.speakers?.map((speaker) => {
    const speakerStatements = props.statements.filter(
      (statement) => statement.speaker.id === speaker.id,
    );

    const grouped = groupBy(speakerStatements, (statement) => {
      switch (statement.assessment.evaluationStatus) {
        case ASSESSMENT_STATUS_APPROVED:
        // When statement is already in proofreading state, the rating won't
        // change, so we can already include it in the stats as well
        case ASSESSMENT_STATUS_PROOFREADING_NEEDED:
          if (
            statement.assessment.assessmentMethodology.ratingModel ===
            AssessmentMethodologyRatingModel.veracity
          ) {
            if (statement.assessment.veracity === null) {
              // If the statement does not have veracity set in proofreading or approved
              // state, don't fail and just log this to sentry
              Sentry.withScope((scope) => {
                scope.setLevel(Sentry.Severity.Warning);
                scope.setExtra('apollo_cache', JSON.stringify(apolloClient.extract()));
                Sentry.captureException(
                  `Expected non-null veracity for statement #${statement.id}`,
                );
              });
              // tslint:disable-next-line:no-console
              console.warn(`Expected non-null veracity for statement #${statement.id}`);

              return 'being-evaluated';
            }

            return statement.assessment.veracity.key;
          }

          if (
            statement.assessment.assessmentMethodology.ratingModel ===
            AssessmentMethodologyRatingModel.promise_rating
          ) {
            if (statement.assessment.promiseRating === null) {
              Sentry.withScope((scope) => {
                scope.setLevel(Sentry.Severity.Warning);
                scope.setExtra('apollo_cache', JSON.stringify(apolloClient.extract()));
                Sentry.captureException(
                  `Expected non-null promise rating for statement #${statement.id}`,
                );
              });
              // tslint:disable-next-line:no-console
              console.warn(`Expected non-null promise rating for statement #${statement.id}`);

              return 'being-evaluated';
            }

            return statement.assessment.promiseRating.key;
          }

        default:
          return 'being-evaluated';
      }
    });

    const stats: string[] = [];
    if (assessmentMethodology.ratingModel === AssessmentMethodologyRatingModel.veracity) {
      assessmentMethodology.ratingKeys.forEach((ratingKey) => {
        const labels = {
          true: 'pravda',
          untrue: 'nepravda',
          misleading: 'zavádějící',
          unverifiable: 'neověřitelné',
        };

        stats.push(get(grouped, [ratingKey, 'length'], 0) + ' ' + labels[ratingKey]);
      });
    }
    if (assessmentMethodology.ratingModel === AssessmentMethodologyRatingModel.promise_rating) {
      assessmentMethodology.ratingKeys.forEach((ratingKey) => {
        const labels = {
          fulfilled: 'splněno',
          in_progress: 'průběžně plněno',
          partially_fulfilled: 'částečně splněno',
          broken: 'porušeno',
          stalled: 'nerealizovano',
        };

        stats.push(get(grouped, [ratingKey, 'length'], 0) + ' ' + labels[ratingKey]);
      });
    }
    stats.push(get(grouped, 'being-evaluated.length', 0) + ' se ještě ověřuje');

    return {
      speaker,
      stats,
    };
  });

  return (
    <div
      className={css`
        background-color: ${Colors.LIGHT_GRAY5};
        padding: 15px 15px 5px 15px;
        margin-top: 20px;
      `}
    >
      {statsBySpeaker?.map(({ speaker, stats }) => (
        <p key={speaker.id}>
          <strong>
            {speaker.firstName} {speaker.lastName}
          </strong>
          <br />
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              {stat}
              <br />
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
};
