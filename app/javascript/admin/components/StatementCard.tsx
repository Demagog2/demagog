import * as React from 'react';

import { Card, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ApolloError } from '@apollo/client';
import { cx } from 'emotion';
import { truncate } from 'lodash';
import { connect, DispatchProp } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import { ASSESSMENT_STATUS_BEING_EVALUATED, ASSESSMENT_STATUS_LABELS } from '../constants';
import { DeleteStatement } from '../queries/mutations';
import { newlinesToBr, pluralize } from '../utils';
import Authorize from './Authorize';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

interface IStatement {
  id: string;
  content: string;
  published: boolean;
  sourceSpeaker: {
    firstName: string;
    lastName: string;
  };
  assessment: {
    evaluationStatus: string;
    evaluator: null | {
      firstName: string | null;
      lastName: string | null;
    };
    shortExplanationCharactersLength: number;
    explanationCharactersLength: number;
  };
  commentsCount: number;
}

interface IProps extends DispatchProp {
  onDeleted?: () => void;
  refetchQueriesAfterDelete?: object[];
  statement: IStatement;
}

interface IState {
  showConfirmDeleteModal: boolean;
}

class StatementCard extends React.Component<IProps, IState> {
  public state = {
    showConfirmDeleteModal: false,
  };

  public toggleConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: !this.state.showConfirmDeleteModal });
  };

  public onDeleted = () => {
    this.props.dispatch(addFlashMessage('Výrok byl úspěšně smazán.', 'success'));

    if (this.props.onDeleted) {
      this.props.onDeleted();
    }
  };

  public onDeleteError = (error: ApolloError) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při mazání výroku.', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  public render() {
    const { refetchQueriesAfterDelete, statement } = this.props;
    const { showConfirmDeleteModal } = this.state;

    const assessment = statement.assessment;

    return (
      <>
        {showConfirmDeleteModal && (
          <ConfirmDeleteModal
            message={`Opravdu chcete smazat výrok "${truncate(statement.content, {
              length: 50,
            })}" od ${statement.sourceSpeaker.firstName} ${statement.sourceSpeaker.lastName}?`}
            onCancel={this.toggleConfirmDeleteModal}
            mutation={DeleteStatement}
            mutationProps={{
              variables: { id: statement.id },
              refetchQueries: refetchQueriesAfterDelete || [],
              onCompleted: this.onDeleted,
              onError: this.onDeleteError,
            }}
          />
        )}

        <Card
          style={{
            marginBottom: 15,
          }}
        >
          <div style={{ float: 'right', marginTop: -8 }}>
            <Link to={`/admin/statements/${statement.id}`} className={Classes.BUTTON}>
              Na detail výroku
            </Link>
            <Authorize permissions={['statements:delete']}>
              <button
                type="button"
                className={cx(Classes.BUTTON, Classes.iconClass(IconNames.TRASH))}
                style={{ marginLeft: 7 }}
                onClick={this.toggleConfirmDeleteModal}
                title="Smazat výrok"
              />
            </Authorize>
          </div>

          <h5 className={Classes.HEADING}>
            {statement.sourceSpeaker.firstName} {statement.sourceSpeaker.lastName}
          </h5>

          <p>{newlinesToBr(statement.content)}</p>

          <small className={Classes.TEXT_MUTED}>
            {statement.published && <>Zveřejněný{' · '}</>}
            Stav: {ASSESSMENT_STATUS_LABELS[assessment.evaluationStatus]}
            {assessment.evaluationStatus === ASSESSMENT_STATUS_BEING_EVALUATED && (
              <>
                {assessment.shortExplanationCharactersLength === 0 &&
                assessment.explanationCharactersLength === 0 ? (
                  <> (odůvodnění zatím prázdné)</>
                ) : (
                  <>
                    {' '}
                    (odůvodnění zkrácené: {assessment.shortExplanationCharactersLength} znaků, celé:{' '}
                    {assessment.explanationCharactersLength} znaků)
                  </>
                )}
              </>
            )}
            {assessment.evaluator && (
              <>
                {' · '}
                Ověřovatel: {assessment.evaluator.firstName} {assessment.evaluator.lastName}
              </>
            )}
            {statement.commentsCount > 0 && (
              <>
                {' · '}
                {statement.commentsCount}{' '}
                {pluralize(statement.commentsCount, 'komentář', 'komentáře', 'komentářů')} v diskuzi
                k výroku
              </>
            )}
          </small>
        </Card>
      </>
    );
  }
}

export default connect()(StatementCard);
