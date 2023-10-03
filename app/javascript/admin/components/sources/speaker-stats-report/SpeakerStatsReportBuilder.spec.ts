import { SpeakerStatsReportBuilder } from './SpeakerStatsReportBuilder';
import { type SourceSpeaker } from '../model/SourceSpeaker';
import { type Statement } from '../model/Statement';
import { statementFactory } from '../model/StatementFactory';
import { veracityStatsFactory } from './model/VeracityStatsFactory';
import { promiseRatingStatsFactory } from './model/PromiseRatingStatsFactory';
import { sourceSpeakerFactory } from '../model/SourceSpeakerFactory';

function createReport(speaker: SourceSpeaker, statements: Statement[] = []) {
  return new SpeakerStatsReportBuilder(speaker, statements).buildReport();
}

describe('SpeakerStatsReportBuilder', () => {
  describe('stats for statements', () => {
    const speaker = sourceSpeakerFactory.build();

    it('has id derived from speaker', () => {
      expect(createReport(speaker).id).toEqual(speaker.getId());
    });

    it('has title derived from speakers full name', () => {
      expect(createReport(speaker).title).toEqual(speaker.getFullName());
    });

    describe('no statements', () => {
      it('has default stats for statement assessment veracities', () => {
        expect(createReport(speaker).stats).toEqual(veracityStatsFactory.build());
      });
    });

    describe('with single true approved statement', () => {
      it('counts as true record', () => {
        const statements = [
          statementFactory
            .withSourceSpeaker(speaker)
            .approved()
            .true()
            .build(),
          statementFactory
            .withSourceSpeaker(sourceSpeakerFactory.build())
            .approved()
            .true()
            .build(),
        ];

        expect(createReport(speaker, statements).stats).toEqual(
          veracityStatsFactory.true(1).build(),
        );
      });
    });

    describe('with statement without veracity', () => {
      it('counts as being evaluated', () => {
        const statements = [statementFactory.withSourceSpeaker(speaker).build()];

        expect(createReport(speaker, statements).stats).toEqual(
          veracityStatsFactory.beingEvaluated(1).build(),
        );
      });
    });

    describe('with true and untrue evaluated statements', () => {
      it('counts as two evaluated records', () => {
        const statements = [
          statementFactory
            .withSourceSpeaker(speaker)
            .beingEvaluated()
            .true()
            .build(),
          statementFactory
            .withSourceSpeaker(speaker)
            .beingEvaluated()
            .untrue()
            .build(),
        ];

        expect(createReport(speaker, statements).stats).toEqual(
          veracityStatsFactory.beingEvaluated(2).build(),
        );
      });
    });

    describe('with true and untrue approved statements', () => {
      it('counts as one true and one untrue record', () => {
        const statements = [
          statementFactory
            .withSourceSpeaker(speaker)
            .approved()
            .true()
            .build(),
          statementFactory
            .withSourceSpeaker(speaker)
            .approved()
            .untrue()
            .build(),
        ];

        expect(createReport(speaker, statements).stats).toEqual(
          veracityStatsFactory
            .true(1)
            .untrue(1)
            .build(),
        );
      });
    });

    describe('with single true being proofread statement', () => {
      it('counts as true record', () => {
        const statements = [
          statementFactory
            .withSourceSpeaker(speaker)
            .true()
            .proofread()
            .build(),
        ];

        expect(createReport(speaker, statements).stats).toEqual(
          veracityStatsFactory.true(1).build(),
        );
      });
    });
  });

  describe('stats for promises', () => {
    const speaker = sourceSpeakerFactory.build();

    it('builds stats for broken promises', () => {
      const statements = statementFactory
        .withSourceSpeaker(speaker)
        .withPromiseAssessment()
        .brokenPromise()
        .buildList(2);

      expect(createReport(speaker, statements).stats).toEqual(
        promiseRatingStatsFactory.broken(2).build(),
      );
    });

    it('builds stats for fulfilled promises', () => {
      const statements = statementFactory
        .withSourceSpeaker(speaker)
        .withPromiseAssessment()
        .fulfilledPromise()
        .buildList(2);

      expect(createReport(speaker, statements).stats).toEqual(
        promiseRatingStatsFactory.fulfilled(2).build(),
      );
    });

    it('builds stats for in progress promises', () => {
      const statements = statementFactory
        .withSourceSpeaker(speaker)
        .withPromiseAssessment()
        .inProgressPromise()
        .buildList(2);

      expect(createReport(speaker, statements).stats).toEqual(
        promiseRatingStatsFactory.inProgress(2).build(),
      );
    });
  });
});
