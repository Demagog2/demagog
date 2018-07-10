import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Select from 'react-select';

const GET_SPEAKERS = gql`
  query {
    speakers(limit: 10000) {
      id
      first_name
      last_name
    }
  }
`;

interface IGetSpeakersQuery {
  speakers: Array<{
    id: string;
    first_name: string;
    last_name: string;
  }>;
}

class GetSpeakersQueryComponent extends Query<IGetSpeakersQuery> {}

interface IProps {
  id?: string;
  value: string[];
  error?: object | false;
  onChange(value: string[]): void;
  onBlur?(): void;
}

export default class SpeakersSelect extends React.Component<IProps> {
  public render() {
    return (
      <GetSpeakersQueryComponent query={GET_SPEAKERS}>
        {({ data, loading }) => {
          let options: Array<{ label: string; value: string }> = [];

          if (data && !loading) {
            options = data.speakers.map((s) => ({
              label: `${s.first_name} ${s.last_name}`,
              value: s.id,
            }));
          }

          return (
            <Select
              id={this.props.id}
              multi
              value={this.props.value}
              isLoading={loading}
              options={options}
              onChange={(selectedOptions: Array<{ value: string }>) =>
                this.props.onChange(selectedOptions.map((o) => o.value))
              }
              onBlur={this.props.onBlur}
              placeholder="Vyberte řečníky …"
              style={{
                borderColor: this.props.error ? Colors.RED3 : '#cccccc',
              }}
            />
          );
        }}
      </GetSpeakersQueryComponent>
    );
  }
}
