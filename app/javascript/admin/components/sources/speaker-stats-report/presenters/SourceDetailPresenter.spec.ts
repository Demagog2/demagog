import { SourceDetailPresenter } from './SourceDetailPresenter';
import { Source } from '../../model/Source';
import { Factory } from 'fishery';
import { statementFactory } from '../model/StatementFactory';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../../../../constants';
import { Evaluator } from '../model/Evaluator';

const filterViewModelFactory = Factory.define<{ key: string; label: string; active: boolean }>(
  () => ({
    type: 'filter',
    key: 'filter-key',
    label: 'Filter label',
    active: false,
  }),
);

describe('SourceDetailPresenter', () => {
  it('builds view model', () => {
    const evaluator = new Evaluator('1', 'John', 'Doe');

    const source = new Source(
      '1',
      'Source name',
      [],
      [
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
    );
    const presenter = new SourceDetailPresenter(source, ['published']);

    const model = presenter.buildViewModel();

    expect(model.id).toEqual(source.id);
    expect(model.name).toEqual(source.name);
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
          filterViewModelFactory.build({ key: 'published', label: 'Published (2)', active: true }),
          filterViewModelFactory.build({ key: 'unpublished', label: 'Unpublished (4)' }),
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
});
