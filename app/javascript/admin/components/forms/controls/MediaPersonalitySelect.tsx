import * as React from 'react';
import { Query } from 'react-apollo';
import { GetMediaPersonalitiesQuery } from '../../../operation-result-types';
import { GetMediaPersonalities } from '../../../queries/queries';

class MediaPersonalitiesQuery extends Query<GetMediaPersonalitiesQuery> {}

interface IMediaSelectProps {
  className?: string;
  defaultValue?: string;
  onChange(evt: React.ChangeEvent<HTMLSelectElement>): void;
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
                defaultValue={this.props.defaultValue}
                required
              >
                <option disabled value={-1}>
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
