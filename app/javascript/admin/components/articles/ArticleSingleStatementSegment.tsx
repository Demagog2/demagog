import * as React from 'react';

import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { css } from 'emotion';
import { Formik } from 'formik';
import { Query } from 'react-apollo';

import {
  GetStatement as GetStatementQuery,
  GetStatementVariables as GetStatementQueryVariables,
} from '../../operation-result-types';
import { GetStatement } from '../../queries/queries';
import TextField from '../forms/controls/TextField';
import FormGroup from '../forms/FormGroup';
import Loading from '../Loading';

const VERACITY_COLORS = {
  true: '#0060ff',
  untrue: '#eb1d2b',
  misleading: '#ffba00',
  unverifiable: '#9dbaeb',
};

interface ISingleStatementSegment {
  id?: string;
  segment_type: string;
  statement_id: string | null;
}

interface IProps {
  segment: ISingleStatementSegment;
  onChange(segment: ISingleStatementSegment): void;
}

interface IState {
  isDialogOpen: boolean;
}

export default class ArticleSingleStatementSegment extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isDialogOpen: false,
    };
  }

  public toggleDialog = () => this.setState({ isDialogOpen: !this.state.isDialogOpen });

  public render() {
    return (
      <div style={{ marginBottom: 20 }}>
        <Button icon={IconNames.PLUS} text="Vybrat výrok" onClick={this.toggleDialog} />

        {this.props.segment.statement_id === null && (
          <p
            className={css`
              margin-top: 10px;
            `}
          >
            Zatím jste nevybrali žádný výrok
          </p>
        )}
        {this.props.segment.statement_id !== null && (
          <div
            className={css`
              margin-top: 10px;
            `}
          >
            <StatementPreview statementId={this.props.segment.statement_id} />
          </div>
        )}

        <SelectStatementDialog
          statementId={this.props.segment.statement_id}
          isOpen={this.state.isDialogOpen}
          onCancel={() => {
            this.toggleDialog();
          }}
          onSelect={(statementId) => {
            this.props.onChange({
              ...this.props.segment,
              statement_id: statementId,
            });
            this.toggleDialog();
          }}
        />
      </div>
    );
  }
}

interface IStatementPreviewProps {
  statementId: string;
}

function StatementPreview({ statementId }: IStatementPreviewProps) {
  return (
    <Query<GetStatementQuery, GetStatementQueryVariables>
      query={GetStatement}
      variables={{ id: parseInt(statementId, 10) }}
    >
      {(props) => {
        if (props.loading) {
          return <Loading />;
        }

        if (!props.data || !props.data.statement) {
          return <div>Výrok s ID {statementId} nenalezen. Je ID správné? Je výrok zveřejněný?</div>;
        }

        const { statement } = props.data;

        return (
          <div>
            <div
              key={statement.id}
              className={css`
                font-family: Lato, sans-serif;
                display: flex;
                margin-top: 20px;
                margin-bottom: 50px;
                font-size: 16px;
                line-height: 1.5;
              `}
            >
              <div
                className={css`
                  flex: 0 0 80px;
                  text-align: center;
                `}
              >
                <div
                  className={css`
                    border-radius: 50%;
                    width: 80px;
                    height: 80px;
                    overflow: hidden;
                    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
                  `}
                >
                  <img
                    src={statement.speaker.avatar || ''}
                    className={css`
                      width: 100%;
                    `}
                  />
                </div>
                <div
                  className={css`
                    color: #3c325c;
                    margin-top: 10px;
                    font-size: 18px;
                    font-weight: 700;
                  `}
                >
                  {statement.speaker.firstName} {statement.speaker.lastName}
                </div>
              </div>

              <div
                className={css`
                  flex: 1 1 auto;
                `}
              >
                <blockquote
                  className={css`
                    position: relative;
                    border-radius: 5px;
                    background: ${statement.important ? '#f3dbd3' : '#d7e5ef'};
                    padding: 10px 15px;
                    margin: 0 0 0 15px;
                    padding-right: ${statement.important ? '45px' : '15px'};
                  `}
                >
                  {statement.content}

                  {statement.important && (
                    <span
                      className={css`
                        position: absolute;
                        right: 0;
                        top: 50%;

                        margin-top: -29px;
                        padding: 0 16px;

                        font-size: 45px;
                        font-weight: 700;
                        color: #f26538;
                      `}
                    >
                      !
                    </span>
                  )}
                </blockquote>

                <div>
                  {statement.assessment.veracity && (
                    <p
                      className={css`
                        font-size: 16px;
                        font-weight: 700;
                        color: ${VERACITY_COLORS[statement.assessment.veracity.key]};
                        text-transform: uppercase;
                        margin: 13px 0 0 15px;
                      `}
                    >
                      {statement.assessment.veracity.name}
                    </p>
                  )}

                  {statement.assessment.shortExplanation && (
                    <p
                      className={css`
                        margin: 5px 0 0 15px;
                      `}
                    >
                      {statement.assessment.shortExplanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Query>
  );
}

class SelectStatementDialog extends React.Component<{
  statementId: string | null;
  isOpen: boolean;
  onSelect(statementId: string): any;
  onCancel(): any;
}> {
  public render() {
    return (
      <Dialog
        icon="inbox"
        isOpen={this.props.isOpen}
        onClose={this.props.onCancel}
        title="Vyberte výrok"
        usePortal
      >
        <Formik
          initialValues={{
            statement_id: this.props.statementId || '',
          }}
          onSubmit={(values) => {
            this.props.onSelect(values.statement_id);
          }}
        >
          {({ handleSubmit }) => (
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                handleSubmit(e);
              }}
            >
              <div className={Classes.DIALOG_BODY}>
                <FormGroup label="ID výroku" name="statement_id">
                  <TextField name="statement_id" />
                </FormGroup>
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  <Button intent={Intent.NONE} onClick={this.props.onCancel} text="Zavřít" />
                  <Button intent={Intent.PRIMARY} type="submit" text="Potvrdit" />
                </div>
              </div>
            </form>
          )}
        </Formik>
      </Dialog>
    );
  }
}
