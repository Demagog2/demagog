import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Select from 'react-select';

const GET_SPEAKERS = gql`
  query {
    speakers(limit: 10000) {
      id
      firstName
      lastName
    }
  }
`;

interface IGetSpeakersQuery {
  speakers: Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;
}

interface ISelectOption {
  label: string;
  value: string;
}

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
      <Query<IGetSpeakersQuery> query={GET_SPEAKERS}>
        {({ data, loading }) => {
          let options: ISelectOption[] = [];

          if (data && !loading) {
            options = data.speakers.map((s) => ({
              label: `${s.firstName} ${s.lastName}`,
              value: s.id,
            }));
          }

          return (
            <Select<ISelectOption>
              id={this.props.id}
              isMulti
              value={options.filter(({ value }) => this.props.value.includes(value))}
              isLoading={loading}
              options={options}
              onChange={(selectedOptions: ISelectOption[]) =>
                this.props.onChange(selectedOptions.map((o) => o.value))
              }
              isClearable
              onBlur={this.props.onBlur}
              placeholder="Vyberte řečníky …"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: this.props.error ? Colors.RED3 : '#cccccc',
                }),
              }}
            />
          );
        }}
      </Query>
    );
  }
}
