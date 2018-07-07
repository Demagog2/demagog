/* eslint camelcase: 0 */

import * as React from 'react';

import { Classes, FormGroup } from '@blueprintjs/core';
// import { DateInput } from '@blueprintjs/datetime';
import * as classNames from 'classnames';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

import { GetSourceQuery, SourceInputType } from '../../operation-result-types';
import DateInput from './controls/DateInput2';
// import { Input } from './controls/Input';
import MediaPersonalitiesSelect from './controls/MediaPersonalitySelect';
import MediumSelect from './controls/MediumSelect';
import SpeakersSelect from './controls/SpeakersSelect';
// import { TextInput } from './controls/TextInput';
import { Form } from './Form';

interface ISourceFormProps {
  backPath: string;
  sourceQuery?: GetSourceQuery;
  onSubmit: (formData: SourceInputType) => void;
  submitting: boolean;
  title: string;
}

class SourceInternalForm extends Form<SourceInputType> {}

function sourceToSourceInput(sourceQuery: GetSourceQuery): SourceInputType {
  const { source } = sourceQuery;

  return {
    name: source.name || '',
    released_at: source.released_at,
    transcript: source.transcript || '',
    medium_id: get(source.medium, 'id'),
    media_personality_id: get(source.media_personality, 'id'),
    source_url: source.source_url,
    speakers: source.speakers.map((speaker) => speaker.id),
  };
}

export class SourceForm extends React.Component<ISourceFormProps> {
  public static defaultProps = {
    sourceQuery: {
      source: {
        medium: {},
        media_personality: {},
        speakers: [],
        released_at: null,
      },
    },
  };

  public render() {
    const { backPath, sourceQuery, submitting, title } = this.props;

    if (!sourceQuery) {
      return null;
    }

    const sourceInput = sourceToSourceInput(sourceQuery);

    return (
      <SourceInternalForm defaultValues={sourceInput} onSubmit={this.props.onSubmit}>
        {({ onInputChange, onAssociationChange }, data) => (
          <div>
            <div style={{ float: 'right' }}>
              <Link to={backPath} className={Classes.BUTTON}>
                Zpět
              </Link>
              <button
                type="submit"
                className={classNames(Classes.BUTTON, Classes.INTENT_PRIMARY)}
                style={{ marginLeft: 7 }}
                disabled={submitting}
              >
                {submitting ? 'Ukládám ...' : 'Uložit'}
              </button>
            </div>

            <h2>{title}</h2>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                <h4>Základní údaje</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup label="Název" labelFor="name">
                  <input
                    id="name"
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    type="text"
                    dir="auto"
                    defaultValue={sourceInput.name || ''}
                    onChange={onInputChange('name')}
                    required
                  />
                </FormGroup>
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: '1 1' }}>
                    <FormGroup label="Pořad" labelFor="medium">
                      <MediumSelect
                        id="medium"
                        onChange={onAssociationChange('medium_id')}
                        value={data.medium_id}
                      />
                    </FormGroup>
                  </div>
                  <div style={{ flex: '1 1', marginLeft: 15 }}>
                    <FormGroup label="Moderátor" labelFor="media-personality">
                      <MediaPersonalitiesSelect
                        id="media-personality"
                        mediumId={data.medium_id}
                        onChange={onAssociationChange('media_personality_id')}
                        value={data.media_personality_id}
                      />
                    </FormGroup>
                  </div>
                </div>
                <FormGroup label="Publikováno" labelFor="released-at">
                  <DateInput
                    id="released-at"
                    value={data.released_at}
                    onChange={onAssociationChange('released_at')}
                  />
                </FormGroup>
                <FormGroup label="Odkaz" labelFor="source-url" requiredLabel>
                  <input
                    id="source-url"
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    type="text"
                    dir="auto"
                    defaultValue={sourceInput.source_url || ''}
                    onChange={onInputChange('source_url')}
                    placeholder="http://www.server.cz/…"
                  />
                </FormGroup>
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                <h4>Řečníci</h4>

                <p>Výroky v rámci tohoto zdroje půjde vytvořit jen pro osoby zde vybrané.</p>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup label="Řečníci" labelFor="speakers">
                  <SpeakersSelect
                    id="speakers"
                    value={data.speakers}
                    onChange={onAssociationChange('speakers')}
                  />
                </FormGroup>
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                <h4>Přepis</h4>

                <p>
                  Je-li dostupný, doporučujeme vyplnit, protože usnaďňuje vytváření výroků
                  označováním v přepisu.
                </p>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup label="Přepis" labelFor="transcript" requiredLabel>
                  <textarea
                    id="transcript"
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    dir="auto"
                    defaultValue={sourceInput.transcript || ''}
                    onChange={onInputChange('transcript')}
                    rows={15}
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        )}
      </SourceInternalForm>
    );
  }
}
