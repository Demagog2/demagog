import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import Select from 'react-select';

const GET_MEDIA_PERSONALITIES = gql`
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
  className?: string;
  value?: string | null;
  mediumId?: string | null;
  onChange(value: string): void;
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
            <div className={`form-group ${this.props.className ? this.props.className : ''}`}>
              <label htmlFor="media-personality-select">Moderátor:</label>
              <Select
                id="media-personality-select"
                disabled={!this.props.mediumId}
                value={this.props.value}
                isLoading={loading}
                options={options}
                onChange={({ value }) => this.props.onChange(value)}
                placeholder="Vyberte moderátora …"
                noResultsText="Žádný moderátor nenalezen"
              />
            </div>
          );
        }}
      </MediaPersonalitiesQueryComponent>
    );
  }
}
