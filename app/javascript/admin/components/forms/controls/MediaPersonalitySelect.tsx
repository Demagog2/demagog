import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import { Query } from 'react-apollo';
import Select from 'react-select';

import type { GetMediaPersonalitiesForSelect as GetMediaPersonalitiesForSelectQuery } from '../../../operation-result-types';
import { GetMediaPersonalitiesForSelect } from '../../../queries/queries';

interface ISelectOption {
  label: string;
  value: string;
}

interface IProps {
  id?: string;
  value: string[];
  error?: object | false;
  onChange: (value: string[]) => void;
  onBlur?: () => void;
}

export default class MediaPersonalitiesSelect extends React.Component<IProps> {
  public render() {
    return (
      <Query<GetMediaPersonalitiesForSelectQuery> query={GetMediaPersonalitiesForSelect}>
        {({ data, loading }) => {
          let options: ISelectOption[] = [];

          if (data && !loading) {
            options = data.mediaPersonalities.map((mp) => ({
              label: mp.name,
              value: mp.id,
            }));
          }

          return (
            <Select<ISelectOption>
              id={this.props.id}
              isMulti
              value={options.filter(({ value }) => this.props.value.includes(value))}
              isLoading={loading}
              options={options}
              onChange={(selectedOptions: ISelectOption[]) => { this.props.onChange(selectedOptions.map((o) => o.value)); }
              }
              isClearable
              placeholder="Vyberte moderátory …"
              onBlur={this.props.onBlur}
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
