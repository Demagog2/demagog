import * as React from 'react';
import { ASSESSMENT_STATUS_APPROVED } from '../../constants';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { Mutation } from 'react-apollo';
import { PublishApprovedSourceStatements } from '../../queries/mutations';
import {
  GetSource as GetSourceQuery,
  GetSourceStatements as GetSourceStatementsQuery,
} from '../../operation-result-types';
import { ApolloError } from 'apollo-client';

interface IMassStatementsPublishModalProps {
  statements: GetSourceStatementsQuery['statements'];
  source: GetSourceQuery['source'];
  onCancel: () => any;
  onCompleted: () => any;
  onError: (error: ApolloError) => any;
}

export class MassStatementsPublishModal extends React.Component<IMassStatementsPublishModalProps> {
  public render() {
    const { source, statements, onCancel, onCompleted, onError } = this.props;

    const approvedAndNotPublished = statements.filter(
      (s) => s.assessment.evaluationStatus === ASSESSMENT_STATUS_APPROVED && !s.published,
    );

    return (
      <Dialog isOpen onClose={onCancel} title="Opravdu zveřejnit?">
        <div className={Classes.DIALOG_BODY}>
          {approvedAndNotPublished.length > 0 ? (
            <>
              Opravdu chceš zveřejnit všech {approvedAndNotPublished.length} schválených a
              nezveřejněných výroků v rámci této diskuze?
            </>
          ) : (
            <>V rámci diskuze teď nemáš žádné schválené a nezveřejněné výroky.</>
          )}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Zpět" onClick={onCancel} />
            {approvedAndNotPublished.length > 0 && (
              <Mutation<any, any>
                mutation={PublishApprovedSourceStatements}
                variables={{ id: source.id }}
              >
                {(mutate, { loading }) => (
                  <Button
                    intent={Intent.PRIMARY}
                    onClick={() =>
                      mutate()
                        // Adding the onCompleted/onError callbacks here, because on Apollo's Mutation
                        // component they don't work in this setup for some reason :/
                        .then(onCompleted)
                        .catch(onError)
                    }
                    text={
                      loading
                        ? 'Zveřejňuju …'
                        : `Zveřejnit ${approvedAndNotPublished.length} výroků`
                    }
                    disabled={loading}
                  />
                )}
              </Mutation>
            )}
          </div>
        </div>
      </Dialog>
    );
  }
}
