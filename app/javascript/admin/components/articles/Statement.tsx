import * as React from 'react';

import { css } from 'emotion';
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
                {statement.speaker.first_name} {statement.speaker.last_name}
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

                {statement.assessment.short_explanation && (
                  <p
                    className={css`
                      margin: 5px 0 0 15px;
                    `}
                  >
                    {statement.assessment.short_explanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      }}
    </GetStatementQueryComponent>
  );
}
