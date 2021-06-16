import { SpeakerStatsReportBuilder } from './SpeakerStatsReportBuilder';
import { speakerFactory } from '../model/SpeakerFactory';
import { Speaker } from '../model/Speaker';
import { Statement } from '../model/Statement';
import { statementFactory } from '../model/StatementFactory';
import { statsFactory } from './model/StatsFactory';

function createReport(speaker: Speaker, statements: Statement[] = []) {
  return new SpeakerStatsReportBuilder(speaker, statements).buildReport();
}

describe('SpeakerStatsReportBuilder', () => {
  describe('stats for political speaker', () => {
    const speaker = speakerFactory.build();

    it('has id derived from speaker', () => {
      expect(createReport(speaker).id).toEqual(speaker.getId());
    });

    it('has title derived from speakers full name', () => {
      expect(createReport(speaker).title).toEqual(speaker.getFullName());
    });

    describe('no statements', () => {
      it('has default stats for statement assessment veracities', () => {
        expect(createReport(speaker).stats).toEqual(statsFactory.build());
      });
    });

    describe('with single true approved statement', () => {
      it('counts as true record', () => {
        const statements = [
          statementFactory
            .withSpeaker(speaker)
            .approved()
            .true()
            .build(),
          statementFactory
            .withSpeaker(speakerFactory.build())
            .approved()
            .true()
            .build(),
        ];

        expect(createReport(speaker, statements).stats).toEqual(statsFactory.true(1).build());
      });
    });

    describe('with statement without veracity', () => {
      it('counts as being evaluated', () => {
        const statements = [statementFactory.withSpeaker(speaker).build()];

        expect(createReport(speaker, statements).stats).toEqual(
          statsFactory.beingEvaluated(1).build(),
        );
      });
    });

    describe('with true and untrue evaluated statements', () => {
      it('counts as two evaluated records', () => {
        const statements = [
          statementFactory
            .withSpeaker(speaker)
            .beingEvaluated()
            .true()
            .build(),
          statementFactory
            .withSpeaker(speaker)
            .beingEvaluated()
            .untrue()
            .build(),
        ];

        expect(createReport(speaker, statements).stats).toEqual(
          statsFactory.beingEvaluated(2).build(),
        );
      });
    });

    describe('with true and untrue approved statements', () => {
      it('counts as one true and one untrue record', () => {
        const statements = [
          statementFactory
            .withSpeaker(speaker)
            .approved()
            .true()
            .build(),
          statementFactory
            .withSpeaker(speaker)
            .approved()
            .untrue()
            .build(),
        ];

        expect(createReport(speaker, statements).stats).toEqual(
          statsFactory
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
            .withSpeaker(speaker)
            .true()
            .proofread()
            .build(),
        ];

        expect(createReport(speaker, statements).stats).toEqual(statsFactory.true(1).build());
      });
    });
  });
});
