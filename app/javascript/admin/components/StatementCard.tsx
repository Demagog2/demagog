import * as React from 'react';

import { Card, Classes } from '@blueprintjs/core';
import { ApolloError } from 'apollo-client';
import { truncate } from 'lodash';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import { ASSESSMENT_STATUS_LABELS } from '../constants';
import { DeleteStatement } from '../queries/mutations';
import { newlinesToBr, pluralize } from '../utils';
import Authorize from './Authorize';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

interface IStatement {
  id: string;
  content: string;
  published: boolean;
  speaker: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  assessment: {
    evaluation_status: string;
    evaluator: null | {
      id: string;
      first_name: string | null;
      last_name: string | null;
    };
  };
  statement_transcript_position: null | {
    start_line: number;
    start_offset: number;
    end_line: number;
    end_offset: number;
  };
  comments_count: number;
}

interface IProps {
  dispatch: Dispatch;
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
    this.props.dispatch(addFlashMessage('Doško k chybě při mazání výroku.', 'error'));

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
            })}" od ${statement.speaker.first_name} ${statement.speaker.last_name}?`}
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
                className={Classes.BUTTON}
                style={{ marginLeft: 7 }}
                onClick={this.toggleConfirmDeleteModal}
              >
                Smazat
              </button>
            </Authorize>
          </div>

          <h5 className={Classes.HEADING}>
            {statement.speaker.first_name} {statement.speaker.last_name}
          </h5>

          <p>{newlinesToBr(statement.content)}</p>

          <small className={Classes.TEXT_MUTED}>
            {statement.published && <>Zveřejněný{' · '}</>}
            Stav: {ASSESSMENT_STATUS_LABELS[assessment.evaluation_status]}
            {assessment.evaluator && (
              <>
                {' · '}
                Ověřovatel: {assessment.evaluator.first_name} {assessment.evaluator.last_name}
              </>
            )}
            {statement.comments_count > 0 && (
              <>
                {' · '}
                {statement.comments_count}{' '}
                {pluralize(statement.comments_count, 'komentář', 'komentáře', 'komentářů')} v
                diskuzi k výroku
              </>
            )}
          </small>
        </Card>
      </>
    );
  }
}

export default connect()(StatementCard);
