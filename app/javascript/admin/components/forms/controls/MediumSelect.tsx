import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import { Query } from 'react-apollo';
import Select from 'react-select';
import { GetMediaQuery } from '../../../operation-result-types';
import { GetMedia } from '../../../queries/queries';

interface ISelectOption {
  label: string;
  value: string;
}

interface IMediaSelectProps {
  id?: string;
  value?: string | null;
  error?: object | false;

  onChange(value: string | null): void;
}

export default class MediumSelect extends React.Component<IMediaSelectProps> {
  public render() {
    return (
      <Query<GetMediaQuery> query={GetMedia} variables={{ name: '' }}>
        {({ data, loading }) => {
          let options: ISelectOption[] = [];

          if (data && !loading) {
            options = data.media.map((mp) => ({
              label: mp.name,
              value: mp.id,
            }));
          }

          return (
            <Select<ISelectOption>
              id={this.props.id}
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
              placeholder="Vyberte pořad …"
              isClearable={false}
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
