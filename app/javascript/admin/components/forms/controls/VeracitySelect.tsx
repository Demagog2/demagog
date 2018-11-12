import * as React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Select from 'react-select';

const GET_VERACITIES = gql`
  query {
    veracities {
      id
      key
      name
    }
  }
`;

interface IGetVeracitiesQuery {
  veracities: Array<{
    id: string;
    key: string;
    name: string;
  }>;
}

interface ISelectOption {
  name: string;
  value: string;
}

interface IProps {
  id?: string;
  disabled?: boolean;
  value?: string | null;
  onChange: (value: string | null) => void;
  onBlur: () => void;
}

export default class VeracitySelect extends React.Component<IProps> {
  public render() {
    return (
      <Query<IGetVeracitiesQuery> query={GET_VERACITIES}>
        {({ data, loading }) => {
          let options: ISelectOption[] = [];

          if (data && !loading) {
            options = data.veracities.map((veracity) => ({
              name: veracity.name,
              value: veracity.id,
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
