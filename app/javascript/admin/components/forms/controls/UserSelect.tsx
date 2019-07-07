import * as React from 'react';

import { Query } from 'react-apollo';
import Select from 'react-select';

import {
  GetUsersForSelect as GetUsersForSelectQuery,
  GetUsersForSelectVariables as GetUsersForSelectQueryVariables,
} from '../../../operation-result-types';
import { GetUsersForSelect } from '../../../queries/queries';

interface ISelectOption {
  label: string;
  value: string;
}

interface IBaseProps {
  id?: string;
  disabled?: boolean;
  roles?: string[];
  onBlur?: () => void;
}

interface ISingleValueProps {
  isMulti: false;
  value?: string | null;
  onChange: (value: string | null) => void;
}

interface IMultiValueProps {
  isMulti: true;
  value: string[];
  onChange: (value: string[]) => void;
}

export default class UserSelect extends React.Component<
  IBaseProps & (ISingleValueProps | IMultiValueProps)
> {
  public static defaultProps = {
    isMulti: false,
  };

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
              value={options.filter(
                ({ value }) =>
                  this.props.isMulti
                    ? this.props.value.includes(value)
                    : value === this.props.value,
              )}
              isLoading={loading}
              isMulti={this.props.isMulti}
              options={options}
              onChange={(selected) => {
                if (this.props.isMulti) {
                  this.props.onChange((selected as ISelectOption[]).map((o) => o.value));
                } else if (selected) {
                  this.props.onChange((selected as ISelectOption).value);
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
