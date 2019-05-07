import * as React from 'react';

import { Query } from 'react-apollo';
import Select from 'react-select';

import {
  GetUsersForSelectQuery,
  GetUsersForSelectQueryVariables,
} from '../../../operation-result-types';
import { GetUsersForSelect } from '../../../queries/queries';

interface ISelectOption {
  label: string;
  value: string;
}

interface IProps {
  id?: string;
  disabled?: boolean;
  value?: string | null;
  roles?: string[];
  onChange: (value: string | null) => void;
  onBlur?: () => void;
}

export default class UserSelect extends React.Component<IProps> {
  public render() {
    return (
      <Query<GetUsersForSelectQuery, GetUsersForSelectQueryVariables>
        query={GetUsersForSelect}
        variables={{ roles: this.props.roles }}
      >
        {({ data, loading }) => {
          let options: ISelectOption[] = [];

          if (data && !loading) {
            options = data.users.map((user) => ({
              label: `${user.firstName} ${user.lastName}`,
              value: user.id,
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
              placeholder="Vyberte …"
              isDisabled={this.props.disabled || false}
            />
          );
        }}
      </Query>
    );
  }
}
