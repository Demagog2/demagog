import * as React from 'react';

import { ApolloError } from 'apollo-client';
import { truncate } from 'lodash';
import { connect } from 'react-redux';

import { addFlashMessage } from '../actions/flashMessages';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_UNASSIGNED,
} from '../constants';
import { DeleteStatement } from '../queries/mutations';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

const STATUS_LABELS = {
  [ASSESSMENT_STATUS_UNASSIGNED]: 'nepřiřazený',
  [ASSESSMENT_STATUS_BEING_EVALUATED]: 've zpracování',
  [ASSESSMENT_STATUS_APPROVAL_NEEDED]: 'ke kontrole',
  [ASSESSMENT_STATUS_APPROVED]: 'schválený',
};

interface IStatement {
  id: string;
  content: string;
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
}

interface IProps {
  addFlashMessage: (msg: string) => void;
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
    this.props.addFlashMessage('Výrok byl úspěšně smazán.');

    if (this.props.onDeleted) {
      this.props.onDeleted();
    }
  };

  public onDeleteError = (error: ApolloError) => {
    this.props.addFlashMessage('Doško k chybě při mazání výroku.');

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

        <div className="card mb-3">
          <div className="card-body">
            <div className="float-right" style={{ marginTop: -7 }}>
              <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
                Na detail výroku
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary ml-1"
                onClick={this.toggleConfirmDeleteModal}
              >
                Smazat
              </button>
            </div>

            <h5>
              {statement.speaker.first_name} {statement.speaker.last_name}
            </h5>
            <p style={{ margin: 0 }}>{statement.content}</p>
          </div>
          <div className="card-footer text-muted small">
            Stav: {STATUS_LABELS[assessment.evaluation_status]}
            {assessment.evaluator && (
              <>
                {' · '}
                Ověřovatel: {assessment.evaluator.first_name} {assessment.evaluator.last_name}
              </>
            )}
            {/* {' · '}1 komentář v diskuzi k výroku */}
          </div>
        </div>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addFlashMessage(message: string) {
      dispatch(addFlashMessage(message));
    },
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(StatementCard);
