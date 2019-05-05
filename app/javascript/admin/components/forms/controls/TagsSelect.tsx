import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Select from 'react-select';

const GET_TAGS = gql`
  query GetTags($forStatementType: StatementType!) {
    tags(limit: 10000, forStatementType: $forStatementType) {
      id
      name
    }
  }
`;

interface IGetTagsQuery {
  tags: Array<{
    id: string;
    name: string;
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
  forStatementType: 'factual' | 'promise';
  onChange(value: string[]): void;
  onBlur?(): void;
}

export default class TagsSelect extends React.Component<IProps> {
  public render() {
    const { forStatementType } = this.props;

    return (
      <Query<IGetTagsQuery> query={GET_TAGS} variables={{ forStatementType }}>
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
              onChange={(selectedOptions: ISelectOption[]) =>
                this.props.onChange(selectedOptions.map((o) => o.value))
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
