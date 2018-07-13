import * as React from 'react';
import { Query } from 'react-apollo';

import Loading from '../Loading';

import { GetStatementQuery, GetStatementQueryVariables } from '../../operation-result-types';
import { GetStatement } from '../../queries/queries';

class GetStatementQueryComponent extends Query<GetStatementQuery, GetStatementQueryVariables> {}

const VERACITY_COLORS = {
  true: '#0060ff',
  untrue: '#eb1d2b',
  misleading: '#ffba00',
  unverifiable: '#9dbaeb',
};

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

        const { statement } = data;

        return (
          <div
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '16px',
              color: '#282828',
              letterSpacing: '0.8px',
              marginBottom: 40,
            }}
          >
            <p>
              <b
                style={{
                  fontStyle: 'normal',
                  fontSize: '14.4px',
                  textTransform: 'uppercase',
                }}
              >
                {statement.speaker.first_name} {statement.speaker.last_name}
              </b>: „{statement.content}“
            </p>

            <div>
              {statement.assessment.veracity && (
                <p
                  style={{
                    fontSize: '19.2px',
                    fontWeight: 700,
                    color: VERACITY_COLORS[statement.assessment.veracity.key],
                    textTransform: 'uppercase',
                  }}
                >
                  {statement.assessment.veracity.name}
                </p>
              )}
            </div>
          </div>
        );
      }}
    </GetStatementQueryComponent>
  );
}
