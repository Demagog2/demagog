import * as React from 'react';

import { Query } from 'react-apollo';
import Select, { Option } from 'react-select';

import { GetRolesQuery } from '../../../operation-result-types';
import { GetRoles } from '../../../queries/queries';

class GetRolesQueryComponent extends Query<GetRolesQuery> {}

interface IProps {
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
            <div className={`form-group ${this.props.className ? this.props.className : ''}`}>
              <label htmlFor="role-select">Přístupová práva:</label>
              <Select
                id="role-select"
                value={this.props.value || undefined}
                isLoading={loading}
                options={options}
                onChange={(option: Option<string>) =>
                  option.value && this.props.onChange(option.value)
                }
                placeholder="Vyberte roli …"
                clearable={false}
              />
            </div>
          );
        }}
      </GetRolesQueryComponent>
    );
  }
}
