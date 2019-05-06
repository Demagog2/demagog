import * as React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Select from 'react-select';

const GET_PROMISE_RATINGS = gql`
  query {
    promiseRatings {
      id
      key
      name
    }
  }
`;

interface IGetPromiseRatingsQuery {
  promiseRatings: Array<{
    id: string;
    key: string;
    name: string;
  }>;
}

interface ISelectOption {
  label: string;
  value: string;
}

interface IProps {
  id?: string;
  disabled?: boolean;
  value?: string | null;
  allowedKeys: string[];
  onChange: (value: string | null) => void;
  onBlur: () => void;
}

export default class PromiseRatingSelect extends React.Component<IProps> {
  public render() {
    return (
      <Query<IGetPromiseRatingsQuery> query={GET_PROMISE_RATINGS}>
        {({ data, loading }) => {
          let options: ISelectOption[] = [];

          if (data && !loading) {
            let promiseRatings = data.promiseRatings;

            promiseRatings = promiseRatings.filter((promiseRating) =>
              this.props.allowedKeys.includes(promiseRating.key),
            );

            options = promiseRatings.map((promiseRating) => ({
              label: promiseRating.name,
              value: promiseRating.id,
            }));
          }

          return (
            <Select<ISelectOption>
              id={this.props.id}
              value={options.filter(({ value }) => value === this.props.value)}
              isLoading={loading}
              options={options}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  this.props.onChange((selectedOption as ISelectOption).value);
                } else {
                  this.props.onChange(null);
                }
              }}
              isClearable
              onBlur={this.props.onBlur}
              placeholder="Zatím nehodnoceno"
              isDisabled={this.props.disabled || false}
            />
          );
        }}
      </Query>
    );
  }
}
