import * as React from 'react';
import { Query } from 'react-apollo';

import Loading from '../Loading';

import { GetStatementQuery, GetStatementQueryVariables } from '../../operation-result-types';
import { GetStatement } from '../../queries/queries';

class GetStatementQueryComponent extends Query<GetStatementQuery, GetStatementQueryVariables> {}

interface IProps {
  id: string;
}

export function Statement(props: IProps) {
  return (
    <GetStatementQueryComponent query={GetStatement} variables={{ id: parseInt(props.id, 10) }}>
      {({ data, loading }) => {
        if (loading) {
          return <Loading />;
        }

        if (!data || !data.statement) {
          return null;
        }

        return (
          <div>
            <h3>
              {data.statement.speaker.first_name} {data.statement.speaker.last_name}
            </h3>
            <p>{data.statement.content}</p>
          </div>
        );
      }}
    </GetStatementQueryComponent>
  );
}
