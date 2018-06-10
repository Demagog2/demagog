import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import Select from 'react-select';

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
  className?: string;
  value?: string | null;

  onChange(value: string): void;
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
            <div className={`form-group ${this.props.className ? this.props.className : ''}`}>
              <label htmlFor="medium-select">Pořad:</label>
              <Select
                id="medium-select"
                value={this.props.value}
                isLoading={loading}
                options={options}
                onChange={({ value }) => this.props.onChange(value)}
                placeholder="Vyberte pořad …"
              />
            </div>
          );
        }}
      </GetMediaQueryComponent>
    );
  }
}
