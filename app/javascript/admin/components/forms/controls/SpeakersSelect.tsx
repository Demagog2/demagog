import gql from 'graphql-tag';
import * as React from 'react';
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
  className?: string;
  value: string[];
  onChange(value: string[]): void;
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
            <div className={`form-group ${this.props.className ? this.props.className : ''}`}>
              <label htmlFor="speakers-select">Rečníci:</label>
              <Select
                id="speakers-select"
                multi
                value={this.props.value}
                isLoading={loading}
                options={options}
                onChange={(selectedOptions) =>
                  this.props.onChange(selectedOptions.map((o) => o.value))
                }
                placeholder="Vyberte řečníky …"
              />
            </div>
          );
        }}
      </GetSpeakersQueryComponent>
    );
  }
}
