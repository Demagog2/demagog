import * as React from 'react';
import { Query } from 'react-apollo';
import { GetMediaPersonalitiesQuery } from '../../../operation-result-types';
import { GetMediaPersonalities } from '../../../queries/queries';

class MediaPersonalitiesQuery extends Query<GetMediaPersonalitiesQuery> {}

interface IMediaSelectProps {
  className?: string;
  onChange(evt: any): void;
}

export class MediaPersonalitiesSelect extends React.Component<IMediaSelectProps> {
  public render() {
    return (
      <MediaPersonalitiesQuery query={GetMediaPersonalities}>
        {({ data, loading }) => {
          if (loading) {
            return 'Loading';
          }

          if (!data) {
            return null;
          }

          return (
            <div className={`form-group ${this.props.className ? this.props.className : ''}`}>
              <label htmlFor="media_personality">Moderátor:</label>
              <select
                name="media_personality"
                className="custom-select"
                onChange={this.props.onChange}
                defaultValue={undefined}
                required
              >
                <option disabled value={undefined}>
                  Vyberte moderátora
                </option>

                {data.media_personalities.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          );
        }}
      </MediaPersonalitiesQuery>
    );
  }
}
