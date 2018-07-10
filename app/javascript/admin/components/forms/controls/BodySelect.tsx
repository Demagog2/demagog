import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import { Query } from 'react-apollo';
import Select, { Option } from 'react-select';

import { GetSpeakerBodiesQuery } from '../../../operation-result-types';
import { GetSpeakerBodies } from '../../../queries/queries';

class GetSpeakerBodiesQueryComponent extends Query<GetSpeakerBodiesQuery> {}

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
      <GetSpeakerBodiesQueryComponent query={GetSpeakerBodies}>
        {({ data, loading }) => {
          let options: Array<{ label: string; value: string }> = [];

          if (data && !loading) {
            options = data.bodies.map((b) => ({
              label: `${b.name} (${b.short_name})`,
              value: b.id,
            }));
          }

          return (
            <Select
              id={this.props.id}
              value={this.props.value || undefined}
              isLoading={loading}
              options={options}
              onChange={(option: Option<string>) =>
                option.value && this.props.onChange(option.value)
              }
              onBlur={this.props.onBlur}
              placeholder="Vyberte…"
              clearable={false}
              style={{
                borderColor: this.props.error ? Colors.RED3 : '#cccccc',
              }}
            />
          );
        }}
      </GetSpeakerBodiesQueryComponent>
    );
  }
}
