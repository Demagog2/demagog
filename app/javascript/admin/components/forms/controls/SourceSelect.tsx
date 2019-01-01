import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import { omit } from 'lodash';
import { Query } from 'react-apollo';
import * as isEqual from 'react-fast-compare';
import Select from 'react-select';

import { GetSourcesForSelectQuery } from '../../../operation-result-types';
import { GetSourcesForSelect } from '../../../queries/queries';
import { displayDate } from '../../../utils';

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

export default class SourceSelect extends React.Component<IProps> {
  public shouldComponentUpdate(nextProps) {
    // Omit handlers, because they are always recreated, but do not change
    const omitProps = ['onChange', 'onBlur'];

    return !isEqual(omit(this.props, omitProps), omit(nextProps, omitProps));
  }

  public render() {
    return (
      <Query<GetSourcesForSelectQuery> query={GetSourcesForSelect}>
        {({ data, loading }) => {
          let options: ISelectOption[] = [];

          if (data && !loading) {
            options = data.sources.map((s) => ({
              label: `${s.name} (${displayDate(s.released_at)}, ${s.medium.name})`,
              value: s.id,
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
                }
              }}
              onBlur={this.props.onBlur}
              placeholder="Vyberte diskuzi…"
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
