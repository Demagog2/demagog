import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import { Query } from 'react-apollo';
import Select from 'react-select';

import { GetSpeakerBodiesQuery } from '../../../operation-result-types';
import { GetSpeakerBodies } from '../../../queries/queries';

interface ISelectOption {
  label: string;
  value: string;
}

interface IProps {
  className?: string;
  error?: object | false;
  id?: string;
  value: string | null;
  onChange(value: string): void;
  onBlur(): void;
}

export default class BodySelect extends React.Component<IProps> {
  public render() {
    return (
      <Query<GetSpeakerBodiesQuery> query={GetSpeakerBodies}>
        {({ data, loading }) => {
          let options: ISelectOption[] = [];

          if (data && !loading) {
            options = data.bodies.map((b) => ({
              label: `${b.name} (${b.short_name})`,
              value: b.id,
            }));
          }

          return (
            <Select
              id={this.props.id}
              value={options.filter(({ value }) => value === this.props.value)}
              isLoading={loading}
              options={options}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  this.props.onChange((selectedOption as ISelectOption).value);
                }
              }}
              onBlur={this.props.onBlur}
              placeholder="Vyberte…"
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
