import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import { Query } from 'react-apollo';
import Select from 'react-select';

import type {
  GetTagsForSelect as GetTagsForSelectQuery,
  GetTagsForSelectVariables as GetTagsForSelectQueryVariables,
  StatementType,
} from '../../../operation-result-types';
import { GetTagsForSelect } from '../../../queries/queries';

interface ISelectOption {
  label: string;
  value: string;
}

interface IProps {
  id?: string;
  value: string[];
  error?: object | false;
  forStatementType: StatementType;
  onChange: (value: string[]) => void;
  onBlur?: () => void;
}

export default class TagsSelect extends React.Component<IProps> {
  public render() {
    const { forStatementType } = this.props;

    return (
      <Query<GetTagsForSelectQuery, GetTagsForSelectQueryVariables>
        query={GetTagsForSelect}
        variables={{ forStatementType }}
      >
        {({ data, loading }) => {
          let options: ISelectOption[] = [];

          if (data && !loading) {
            options = data.tags.map((t) => ({
              label: t.name,
              value: t.id,
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
              onBlur={this.props.onBlur}
              placeholder="Vyberte štítky …"
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
