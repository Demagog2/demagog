import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Select, { Option } from 'react-select';

export const GET_MEDIA_PERSONALITIES = gql`
  query {
    media_personalities {
      id
      name
      media {
        id
      }
    }
  }
`;

interface IGetMediaPersonalitiesQuery {
  media_personalities: Array<{
    id: string;
    name: string;
    media: Array<{
      id: string;
    }>;
  }>;
}

class MediaPersonalitiesQueryComponent extends Query<IGetMediaPersonalitiesQuery> {}

interface IMediaSelectProps {
  id?: string;
  value?: string | null;
  error?: object | false;
  mediumId?: string | null;
  mediumOptional?: boolean;
  onChange(value: string | null): void;
}

export default class MediaPersonalitiesSelect extends React.Component<IMediaSelectProps> {
  public render() {
    return (
      <MediaPersonalitiesQueryComponent query={GET_MEDIA_PERSONALITIES}>
        {({ data, loading }) => {
          let options: Array<{ label: string; value: string }> = [];

          if (data && !loading) {
            let mediaPersonalities = data.media_personalities;

            if (this.props.mediumId) {
              mediaPersonalities = mediaPersonalities.filter((mp) =>
                mp.media.find((m) => m.id === this.props.mediumId),
              );
            }

            options = mediaPersonalities.map((mp) => ({
              label: mp.name,
              value: mp.id,
            }));
          }

          return (
            <Select
              id={this.props.id}
              disabled={!this.props.mediumOptional && !this.props.mediumId}
              value={this.props.value || undefined}
              isLoading={loading}
              options={options}
              onChange={(option: Option<string>) => this.props.onChange(option.value || null)}
              placeholder="Vyberte moderátora …"
              noResultsText="Žádný moderátor nenalezen"
              style={{
                borderColor: this.props.error ? Colors.RED3 : '#cccccc',
              }}
            />
          );
        }}
      </MediaPersonalitiesQueryComponent>
    );
  }
}
