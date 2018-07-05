import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import Select, { Option } from 'react-select';

const GET_USERS = gql`
  query {
    users(limit: 200) {
      id
      first_name
      last_name
    }
  }
`;

interface IGetUsersQuery {
  users: Array<{
    id: string;
    first_name: string;
    last_name: string;
  }>;
}

class GetUsersQueryComponent extends Query<IGetUsersQuery> {}

interface IProps {
  id?: string;
  disabled?: boolean;
  value?: string | null;
  onChange: (value: string | null) => void;
  onBlur: () => void;
}

export default class UserSelect extends React.Component<IProps> {
  public render() {
    return (
      <GetUsersQueryComponent query={GET_USERS}>
        {({ data, loading }) => {
          let options: Array<{ label: string; value: string }> = [];

          if (data && !loading) {
            options = data.users.map((user) => ({
              label: `${user.first_name} ${user.last_name}`,
              value: user.id,
            }));
          }

          return (
            <Select
              id={this.props.id}
              value={this.props.value || undefined}
              isLoading={loading}
              options={options}
              onChange={(option: Option<string>) =>
                this.props.onChange((option && option.value) || null)
              }
              onBlur={this.props.onBlur}
              placeholder="Vyberte …"
              disabled={this.props.disabled || false}
            />
          );
        }}
      </GetUsersQueryComponent>
    );
  }
}
