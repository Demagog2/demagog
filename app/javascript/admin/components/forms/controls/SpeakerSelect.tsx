import * as React from 'react';

import { Colors } from '@blueprintjs/core';
import { Query } from 'react-apollo';
import Select from 'react-select';

import * as ResultTypes from '../../../operation-result-types';
import { GetSpeakersForSelect } from '../../../queries/queries';

interface ISelectOption {
  label: string;
  value: string;
}

interface IProps {
  id?: string;
  value: string | null;
  error?: object | false;
  onChange(value: string | null, speaker: ResultTypes.GetSpeakersForSelect_speakers | null): void;
  onBlur?(): void;
}

export default class SpeakerSelect extends React.Component<IProps> {
  public render() {
    return (
      <Query<ResultTypes.GetSpeakersForSelect> query={GetSpeakersForSelect}>
        {({ data, loading }) => {
          let options: ISelectOption[] = [];
          const speakersById = {};

          if (data && !loading) {
            options = data.speakers.map((s) => {
              let label = `${s.firstName} ${s.lastName}`;

              if (s.body) {
                label += ` (${s.body.shortName})`;
              }
              if (s.role) {
                label += ` - ${s.role}`;
              }

              return {
                label,
                value: s.id,
              };
            });
            data.speakers.forEach((s) => {
              speakersById[s.id] = s;
            });
          }

          return (
            <Select<ISelectOption>
              id={this.props.id}
              isMulti={false}
              value={options.filter(({ value }) => this.props.value === value)}
              isLoading={loading}
              options={options}
              onChange={(selectedOption: ISelectOption | null) => {
                const speakerId = selectedOption ? selectedOption.value : null;
                const speaker = speakerId ? speakersById[speakerId] : null;

                this.props.onChange(speakerId, speaker);
              }}
              isClearable
              onBlur={this.props.onBlur}
              placeholder="Vyberte osobu …"
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
