import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Select, { Option } from 'react-select';

const GET_MEDIA = gql`
  query {
    media {
      id
      name
    }
  }
`;

interface IGetMediaQuery {
  media: Array<{
    id: string;
    name: string;
  }>;
}

class GetMediaQueryComponent extends Query<IGetMediaQuery> {}

interface IMediaSelectProps {
  id?: string;
  value?: string | null;
  error?: object | false;

  onChange(value: string | null): void;
}

export default class MediumSelect extends React.Component<IMediaSelectProps> {
  public render() {
    return (
      <GetMediaQueryComponent query={GET_MEDIA}>
        {({ data, loading }) => {
          let options: Array<{ label: string; value: string }> = [];

          if (data && !loading) {
            options = data.media.map((mp) => ({
              label: mp.name,
              value: mp.id,
            }));
          }

          return (
            <Select
              id={this.props.id}
              value={this.props.value || undefined}
              isLoading={loading}
              options={options}
              onChange={(option: Option<string>) => this.props.onChange(option.value || null)}
              placeholder="Vyberte pořad …"
              clearable={false}
              style={{
                borderColor: this.props.error ? Colors.RED3 : '#cccccc',
              }}
            />
          );
        }}
      </GetMediaQueryComponent>
    );
  }
}
