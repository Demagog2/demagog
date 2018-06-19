import * as React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Select, { Option } from 'react-select';

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

class GetVeracitiesQueryComponent extends Query<IGetVeracitiesQuery> {}

interface IProps {
  disabled?: boolean;
  value?: string | null;
  onChange: (value: string | null) => void;
  onBlur: () => void;
}

export default class VeracitySelect extends React.Component<IProps> {
  public render() {
    return (
      <GetVeracitiesQueryComponent query={GET_VERACITIES}>
        {({ data, loading }) => {
          let options: Array<{ label: string; value: string }> = [];

          if (data && !loading) {
            options = data.veracities.map((veracity) => ({
              label: veracity.name,
              value: veracity.id,
            }));
          }

          return (
            <Select
              value={this.props.value || undefined}
              isLoading={loading}
              options={options}
              onChange={(option: Option<string>) =>
                this.props.onChange((option && option.value) || null)
              }
              onBlur={this.props.onBlur}
              placeholder="Zatím nehodnoceno"
              disabled={this.props.disabled || false}
            />
          );
        }}
      </GetVeracitiesQueryComponent>
    );
  }
}
