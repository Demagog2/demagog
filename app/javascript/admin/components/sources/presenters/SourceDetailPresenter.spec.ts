import { SourceDetailPresenter } from './SourceDetailPresenter';
import { type ISource } from '../model/Source';
import { Factory } from 'fishery';
import { statementFactory } from '../model/StatementFactory';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../../../constants';
import { Evaluator } from '../model/Evaluator';
import { Expert } from '../model/Expert';
import { Medium } from '../model/Medium';
import { MediaPersonality } from '../model/MediaPersonality';
import { sourceSpeakerFactory } from '../model/SourceSpeakerFactory';

const filterViewModelFactory = Factory.define<{ key: string; label: string; active: boolean }>(
  () => ({
    type: 'filter',
    key: 'filter-key',
    label: 'Filter label',
    active: false,
  }),
);

describe('SourceDetailPresenter', () => {
  const evaluator = new Evaluator('1', 'John', 'Doe');

  const source: ISource = {
    id: '1',
    name: 'Source name',
    sourceUrl: 'http://example.com',
    releasedAt: '2020-01-13 17:00',
    experts: [new Expert('1', 'John', 'Expert')],
    sourceSpeakers: sourceSpeakerFactory.buildList(2),
    statements: [
      ...statementFactory
        .withEvaluator(evaluator)
        .published()
        .buildList(2),
      statementFactory
        .withEvaluator(evaluator)
        .approved()
        .build(),
      statementFactory
        .withoutEvaluator()
        .beingEvaluated()
        .build(),
      statementFactory
        .withEvaluator(evaluator)
        .proofread()
        .build(),
      statementFactory
        .withEvaluator(evaluator)
        .approvalNeeded()
        .build(),
    ],
    mediaPersonalities: [new MediaPersonality('1', 'John Doe')],
    medium: new Medium('1', 'BBC News'),
  };

  const presenter = new SourceDetailPresenter(source, ['published']);

  const model = presenter.buildViewModel();

  describe('#buildViewModel', () => {
    it('contains information about source', () => {
      expect(model.id).toEqual(source.id);
      expect(model.name).toEqual(source.name);
      expect(model.sourceUrl).toEqual(source.sourceUrl);
      expect(model.releasedAt).toEqual(source.releasedAt);
    });

    it('contains information about experts', () => {
      expect(model.experts).toEqual(['John Expert']);
    });

    it('contains information about total number of statements', () => {
      expect(model.statementsTotalCount).toBe(6);
    });

    it('contains information about media', () => {
      expect(model.medium).toEqual('BBC News');
    });

    it('contains information about media personalities', () => {
      expect(model.mediaPersonalities).toEqual(['John Doe']);
    });

    it('contains information about filtered statements', () => {
      const statement = model.filteredStatements[0];

      expect(statement).toEqual({
        id: '1',
        content: 'Content 1',
        published: true,
        sourceSpeaker: {
          firstName: 'First name 3',
          lastName: 'Doe',
        },
        assessment: {
          evaluator: {
            firstName: 'John',
            lastName: 'Doe',
          },
          evaluationStatus: ASSESSMENT_STATUS_APPROVED,
          explanationCharactersLength: 560,
          shortExplanationCharactersLength: 100,
        },
        commentsCount: 30,
      });
    });

    it('contains information about filters', () => {
      expect(model.filters).toEqual([
        {
          type: 'filter-group',
          label: 'Filtrovat dle stavu',
          filters: [
            filterViewModelFactory.build({
              key: ASSESSMENT_STATUS_BEING_EVALUATED,
              label: 'Ve zpracování (1)',
            }),
            filterViewModelFactory.build({
              key: ASSESSMENT_STATUS_APPROVAL_NEEDED,
              label: 'Ke kontrole (1)',
            }),
            filterViewModelFactory.build({
              key: ASSESSMENT_STATUS_PROOFREADING_NEEDED,
              label: 'Ke korektuře (1)',
            }),
            filterViewModelFactory.build({
              key: ASSESSMENT_STATUS_APPROVED,
              label: 'Schválené (3)',
            }),
          ],
        },
        {
          type: 'filter-group',
          label: 'Filtrovat dle zveřejnění',
          filters: [
            filterViewModelFactory.build({
              key: 'published',
              label: 'Zveřejněné (2)',
              active: true,
            }),
            filterViewModelFactory.build({ key: 'unpublished', label: 'Nezveřejněné (4)' }),
          ],
        },
        filterViewModelFactory.build({
          key: 'unpublished-and-verified',
          label: 'Nezveřejněné, schválené (1)',
        }),
        {
          type: 'filter-group',
          label: 'Filtrovat dle ověřovatele',
          filters: [
            filterViewModelFactory.build({ key: 'evaluator-1', label: 'John Doe (5)' }),
            filterViewModelFactory.build({ key: 'unassigned-evaluator', label: 'Nepřiřazené (1)' }),
          ],
        },
      ]);
    });

    it('contains information about speaker stats', () => {
      expect(model.speakerStats).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            // TODO: Is there a better way how to do this?
            stats: expect.arrayContaining([
              expect.any(String),
              expect.any(String),
              expect.any(String),
              expect.any(String),
              expect.any(String),
            ]),
          }),
        ]),
      );
    });
  });
});
