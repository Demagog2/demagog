/* eslint camelcase: 0 */

import * as React from 'react';
import { Link } from 'react-router-dom';

import { get } from 'lodash';

import { GetSourceQuery, SourceInputType } from '../../operation-result-types';
import DateInput from './controls/DateInput';
import { Input } from './controls/Input';
import { MediaPersonalitiesSelect } from './controls/MediaPersonalitySelect';
import { MediaSelect } from './controls/MediaSelect';
import { TextInput } from './controls/TextInput';
import { Form } from './Form';

interface ISourceFormProps {
  sourceQuery?: GetSourceQuery;
  onSubmit: (formData: SourceInputType) => void;
  submitting: boolean;
}

class SourceInternalForm extends Form<SourceInputType> {}

function sourceToSourceInput(sourceQuery: GetSourceQuery): SourceInputType {
  const { source } = sourceQuery;

  return {
    name: source.name,
    released_at: source.released_at,
    transcript: source.transcript || '',
    medium_id: get(source.medium, 'id'),
    media_personality_id: get(source.media_personality, 'id'),
    source_url: source.source_url,
  };
}

export class SourceForm extends React.Component<ISourceFormProps> {
  public static defaultProps = {
    sourceQuery: {
      source: {
        medium: {},
        media_personality: {},
      },
    },
  };

  public render() {
    const { sourceQuery, submitting } = this.props;

    if (!sourceQuery) {
      return null;
    }

    return (
      <SourceInternalForm
        defaultValues={sourceToSourceInput(sourceQuery)}
        onSubmit={this.props.onSubmit}
      >
        {({ onInputChange /*, onCheckboxChange, onImageChange*/ }) => (
          <React.Fragment>
            <Input
              required
              id="name"
              label="Název"
              defaultValue={sourceQuery.source.name}
              placeholder="Zadejte název"
              onChange={onInputChange('name')}
            />

            <div className="form-row">
              <Input
                className="col-md-6"
                id="source_url"
                label="Odkaz"
                defaultValue={sourceQuery.source.source_url}
                placeholder="Zadejte odkaz"
                onChange={onInputChange('source_url')}
              />

              {/* FIXME: don't let me have to define .form-group */}
              <div className="form-group col-md-6">
                <DateInput
                  required={true}
                  name="released_at"
                  label="Publikováno"
                  placeholder="Zadejte datum"
                  defaultValue={sourceQuery.source.released_at}
                  onChange={onInputChange('released_at')}
                />
              </div>
            </div>

            <div className="form-row">
              <MediaSelect className="col-md-6" onChange={onInputChange('medium_id')} />

              <MediaPersonalitiesSelect
                className="col-md-6"
                onChange={onInputChange('media_personality_id')}
              />
            </div>

            <div className="form-row">
              <TextInput
                className="col-md-12"
                placeholder="Zadejte text přepisu..."
                defaultValue={sourceQuery.source.transcript}
                onChange={onInputChange('transcript')}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Ukládám ...' : 'Uložit'}
            </button>
            <Link to="/admin/statements" className="btn">
              Zpět na seznam
            </Link>
          </React.Fragment>
        )}
      </SourceInternalForm>
    );
  }
}
