import * as React from 'react';

import { Query } from 'react-apollo';
import Select from 'react-select';

import { GetPromiseRatingsForSelectQuery } from '../../../operation-result-types';
import { GetPromiseRatingsForSelect } from '../../../queries/queries';

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
      <Query<GetPromiseRatingsForSelectQuery> query={GetPromiseRatingsForSelect}>
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
