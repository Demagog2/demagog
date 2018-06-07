import * as React from 'react';
import { Query } from 'react-apollo';
import { GetMediaQuery } from '../../../operation-result-types';
import { GetMedia } from '../../../queries/queries';

class MediaSelectQuery extends Query<GetMediaQuery> {}

interface IMediaSelectProps {
  className?: string;
  // TODO: Replace any
  onChange(evt: any): void;
}

export class MediaSelect extends React.Component<IMediaSelectProps> {
  public render() {
    return (
      <MediaSelectQuery query={GetMedia}>
        {({ data, loading }) => {
          if (loading) {
            return 'Loading';
          }

          if (!data) {
            return null;
          }

          return (
            <div className={`form-group ${this.props.className ? this.props.className : ''}`}>
              <label htmlFor="illustration">Médium:</label>
              <select
                name="medium"
                className="custom-select"
                onChange={this.props.onChange}
                defaultValue={undefined}
                required
              >
                <option disabled value={undefined}>
                  Vyberte médium
                </option>

                {data.media.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          );
        }}
      </MediaSelectQuery>
    );
  }
}
