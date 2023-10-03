import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import { Query } from 'react-apollo';
import Select from 'react-select';

import type { GetSpeakerBodies as GetSpeakerBodiesQuery } from '../../../operation-result-types';
import { GetSpeakerBodies } from '../../../queries/queries';

interface ISelectOption {
  label: string;
  value: string;
}

interface IProps {
  className?: string;
  error?: object | false;
  id?: string;
  isClearable?: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
  onBlur: () => void;
}

export default class BodySelect extends React.Component<IProps> {
  public render() {
    return (
      <Query<GetSpeakerBodiesQuery> query={GetSpeakerBodies}>
        {({ data, loading }) => {
          let options: ISelectOption[] = [];

          if (data && !loading) {
            options = data.bodies.map((b) => ({
              label: `${b.name} (${b.shortName})`,
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
                this.props.onChange(
                  selectedOption ? (selectedOption as ISelectOption).value : null,
                );
              }}
              onBlur={this.props.onBlur}
              placeholder="Vyberte…"
              isClearable={this.props.isClearable === true}
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
