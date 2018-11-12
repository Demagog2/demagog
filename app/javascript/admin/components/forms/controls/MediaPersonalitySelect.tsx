import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Select from 'react-select';

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

interface ISelectOption {
  label: string;
  value: string;
}

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
      <Query<IGetMediaPersonalitiesQuery> query={GET_MEDIA_PERSONALITIES}>
        {({ data, loading }) => {
          let options: ISelectOption[] = [];

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
            <Select<ISelectOption>
              id={this.props.id}
              isDisabled={!this.props.mediumOptional && !this.props.mediumId}
              value={options.filter(({ value }) => value === this.props.value)}
              isLoading={loading}
              options={options}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  this.props.onChange((selectedOption as ISelectOption).value);
                } else {
                  this.props.onChange(null);
                }
              }}
              isClearable
              placeholder="Vyberte moderátora …"
              noOptionsMessage={({ inputValue }) =>
                inputValue
                  ? `Žádný moderátor jména ${inputValue} nenalezen`
                  : 'Žádný moderátor nenalezen'
              }
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
