import * as React from 'react';

import { Query } from 'react-apollo';
import Select, { Option } from 'react-select';

import { GetRolesQuery } from '../../../operation-result-types';
import { GetRoles } from '../../../queries/queries';

class GetRolesQueryComponent extends Query<GetRolesQuery> {}

interface IProps {
  id?: string;
  className?: string;
  value: string | null;
  onChange(value: string): void;
}

export default class RoleSelect extends React.Component<IProps> {
  public render() {
    return (
      <GetRolesQueryComponent query={GetRoles}>
        {({ data, loading }) => {
          let options: Array<{ label: string; value: string }> = [];

          if (data && !loading) {
            options = data.roles.map((r) => ({
              label: r.name,
              value: r.id,
            }));
          }

          return (
            <Select
              id={this.props.id}
              value={this.props.value || undefined}
              isLoading={loading}
              options={options}
              onChange={(option: Option<string>) =>
                option.value && this.props.onChange(option.value)
              }
              placeholder="Vyberte roli …"
              clearable={false}
            />
          );
        }}
      </GetRolesQueryComponent>
    );
  }
}
