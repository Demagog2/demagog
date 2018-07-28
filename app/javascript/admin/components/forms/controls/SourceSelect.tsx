import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import { omit } from 'lodash';
import { Query } from 'react-apollo';
import * as isEqual from 'react-fast-compare';
import Select, { Option } from 'react-select';

import { GetSourcesForSelectQuery } from '../../../operation-result-types';
import { GetSourcesForSelect } from '../../../queries/queries';
import { displayDate } from '../../../utils';

class GetSourcesForSelectQueryComponent extends Query<GetSourcesForSelectQuery> {}

interface IProps {
  className?: string;
  error?: object | false;
  id?: string;
  value: string | null;
  onChange(value: string): void;
  onBlur(): void;
}

export default class SourceSelect extends React.Component<IProps> {
  public shouldComponentUpdate(nextProps) {
    // Omit handlers, because they are always recreated, but do not change
    const omitProps = ['onChange', 'onBlur'];

    return !isEqual(omit(this.props, omitProps), omit(nextProps, omitProps));
  }

  public render() {
    return (
      <GetSourcesForSelectQueryComponent query={GetSourcesForSelect}>
        {({ data, loading }) => {
          let options: Array<{ label: string; value: string }> = [];

          if (data && !loading) {
            options = data.sources.map((s) => ({
              label: `${s.name} (${displayDate(s.released_at)}, ${s.medium.name}, ${
                s.media_personality.name
              })`,
              value: s.id,
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
              placeholder="Vyberte diskuzi…"
              clearable={false}
              style={{
                borderColor: this.props.error ? Colors.RED3 : '#cccccc',
              }}
            />
          );
        }}
      </GetSourcesForSelectQueryComponent>
    );
  }
}
