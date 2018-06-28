/* eslint camelcase: 0 */

import * as React from 'react';
import { Link } from 'react-router-dom';

import { BodyInputType, GetBodyQuery } from '../../operation-result-types';
import BodyLogo from '../BodyLogo';
import DateInput from './controls/DateInput';
import ImageInput, { ImageValueType } from './controls/ImageInput';
import { Form } from './Form';

export interface IBodyFormData extends BodyInputType {
  logo: ImageValueType;
}

interface IBodyProps {
  bodyQuery?: GetBodyQuery;
  onSubmit: (formData: IBodyFormData) => void;
  submitting: boolean;
  title: string;
}

class BodyInternalForm extends Form<IBodyFormData> {}

export class BodyForm extends React.Component<IBodyProps> {
  public static defaultProps = {
    bodyQuery: {
      body: {
        founded_at: '',
        id: '',
        is_inactive: false,
        is_party: true,
        link: '',
        logo: null,
        name: '',
        short_name: '',
        terminated_at: '',
      },
    },
  };

  public render() {
    const { bodyQuery, submitting, title } = this.props;

    if (!bodyQuery) {
      return null;
    }

    return (
      <BodyInternalForm defaultValues={bodyQuery.body} onSubmit={this.props.onSubmit}>
        {({ onInputChange, onCheckboxChange, onImageChange }) => (
          <div style={{ paddingBottom: 50 }}>
            <div className="float-right">
              <Link to="/admin/bodies" className="btn btn-secondary">
                Zpět
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginLeft: 7 }}
                disabled={submitting}
              >
                {submitting ? 'Ukládám ...' : 'Uložit'}
              </button>
            </div>

            <h3 style={{ marginBottom: 25 }}>{title}</h3>

            <div className="form-group">
              <label className="form-control-label" htmlFor="name">
                Název:
              </label>
              <input
                required
                id="name"
                className="form-control"
                placeholder="Zadejte název"
                onChange={onInputChange('name')}
                defaultValue={bodyQuery.body.name}
              />
              <div className="invalid-feedback">Prosím zadejte název</div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-3">
                <div className="form-check">
                  <input
                    id="is-party"
                    name="is-party"
                    className="form-check-input s-is_party"
                    type="checkbox"
                    onChange={onCheckboxChange('is_party')}
                    defaultChecked={bodyQuery.body.is_party}
                  />
                  <label className="form-check-label" htmlFor="is-party">
                    jde o politickou stranu
                  </label>
                </div>
              </div>

              <div className="form-group col-md-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={onCheckboxChange('is_inactive')}
                    defaultChecked={bodyQuery.body.is_inactive}
                    id="is-inactive"
                  />
                  <label className="form-check-label" htmlFor="is-inactive">
                    skupina zanikla / není aktivní
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="short_name">Zkratka:</label>
                <input
                  className="form-control s-short_name"
                  id="short_name"
                  placeholder="Zadejte zkratku"
                  onChange={onInputChange('short_name')}
                  defaultValue={bodyQuery.body.short_name || ''}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-12">
                <ImageInput
                  label="Logo / ilustrační obrázek"
                  name="logo"
                  defaultValue={bodyQuery.body.logo}
                  onChange={onImageChange('logo')}
                  renderImage={(src) => <BodyLogo logo={src} />}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="link">
                Respekovaný odkaz obsahující popis (wikipedia, nasipolitici, atp.):
              </label>
              <input
                className="form-control s-link"
                id="link"
                placeholder="Zadejte odkaz"
                defaultValue={bodyQuery.body.link || ''}
                onChange={onInputChange('link')}
              />
            </div>

            <div className="form-row">
              <div className="form-group col-md-6 s-founded_at">
                <DateInput
                  label="Vznik"
                  name="founded_at"
                  placeholder="Zadejte datum vzniku"
                  onChange={onInputChange('founded_at')}
                  defaultValue={bodyQuery.body.founded_at || ''}
                />
              </div>

              <div className="form-group col-md-6 s-terminated_at">
                <DateInput
                  label="Zánik"
                  name="terminated_at"
                  placeholder="Zadejte datum zániku"
                  onChange={onInputChange('terminated_at')}
                  defaultValue={bodyQuery.body.terminated_at || ''}
                />
              </div>
            </div>
          </div>
        )}
      </BodyInternalForm>
    );
  }
}
