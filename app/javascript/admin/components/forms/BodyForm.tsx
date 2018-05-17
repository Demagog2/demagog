/* eslint camelcase: 0 */

import * as React from 'react';
import { Link } from 'react-router-dom';

import { BodyInputType, GetBodyQuery } from '../../operation-result-types';
import BodyLogo from '../BodyLogo';
import DateInput from './controls/DateInput';
import ImageInput, { ImageValueType } from './controls/ImageInput';

export interface IBodyFormData extends BodyInputType {
  logo: ImageValueType;
}

interface IBodyProps {
  bodyQuery?: GetBodyQuery;
  onSubmit: (formData: IBodyFormData) => void;
  submitting: boolean;
}

interface IBodyFields {
  name?: string;
  short_name?: string;
  logo?: ImageValueType;
  link?: string;
  is_party?: boolean;
  is_inactive?: boolean;
  founded_at?: string;
  terminated_at?: string;
}

interface IBodyState extends IBodyFields {
  isFormValidated: boolean;
}

export class BodyForm extends React.Component<IBodyProps, IBodyState> {
  public static defaultProps = {
    bodyQuery: {
      body: {
        description: '',
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

  constructor(props: IBodyProps) {
    super(props);

    if (props.bodyQuery) {
      this.state = {
        founded_at: props.bodyQuery.body.founded_at || undefined,
        isFormValidated: false,
        is_inactive: props.bodyQuery.body.is_inactive,
        is_party: props.bodyQuery.body.is_party,
        link: props.bodyQuery.body.link || undefined,
        name: props.bodyQuery.body.name,
        short_name: props.bodyQuery.body.short_name || undefined,
        logo: props.bodyQuery.body.logo,
        terminated_at: props.bodyQuery.body.terminated_at || undefined,
      };
    }
  }

  public render() {
    const { bodyQuery, submitting } = this.props;
    const { logo } = this.state;

    if (!bodyQuery || logo === undefined) {
      return null;
    }

    return (
      <form
        className={this.state.isFormValidated ? 'was-validated' : ''}
        noValidate
        onSubmit={this.onSubmit}
      >
        <div className="form-group">
          <label className="form-control-label" htmlFor="name">
            Název:
          </label>
          <input
            required
            id="name"
            className="form-control"
            placeholder="Zadejte název"
            onChange={this.onChange('name')}
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
                onChange={this.onCheckboxChange('is_party')}
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
                onChange={this.onCheckboxChange('is_inactive')}
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
              onChange={this.onChange('short_name')}
              defaultValue={bodyQuery.body.short_name || ''}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-12">
            <ImageInput
              label="Logo / ilustrační obrázek"
              name="logo"
              value={logo}
              onChange={this.onImageChange('logo')}
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
            onChange={this.onChange('link')}
          />
        </div>

        <div className="form-row">
          <div className="form-group col-md-6 s-founded_at">
            <DateInput
              label="Vznik"
              name="founded_at"
              placeholder="Zadejte datum vzniku"
              onChange={this.onChange('founded_at')}
              defaultValue={bodyQuery.body.founded_at || ''}
            />
          </div>

          {this.state.is_inactive && (
            <div className="form-group col-md-6 s-terminated_at">
              <DateInput
                label="Zánik"
                name="terminated_at"
                placeholder="Zadejte datum zániku"
                onChange={this.onChange('terminated_at')}
                defaultValue={bodyQuery.body.terminated_at || ''}
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Ukládám ...' : 'Uložit'}
        </button>
        <Link to="/admin/bodies" className="btn">
          Zpět na seznam
        </Link>
      </form>
    );
  }

  // TODO: Replace any with specific event type
  private onSubmit = (evt: any) => {
    evt.preventDefault();

    const isValid = evt.target.checkValidity();

    if (isValid) {
      this.props.onSubmit(this.getFormValues());
    }

    this.setState({ isFormValidated: true });
  };

  private onChange = (name: keyof IBodyFields) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    const state: { [P in keyof Extract<IBodyFields, string>]: string } = {
      [name]: evt.target.value,
    };

    this.setState(state);
  };

  private onImageChange = (name: keyof IBodyFields) => (value: ImageValueType) => {
    const state: { [P in keyof Extract<IBodyFields, string>]: string } = {
      [name]: value,
    };

    this.setState(state);
  };

  private onCheckboxChange = (name: keyof IBodyFields) => (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const state: { [P in keyof Extract<IBodyFields, boolean>]: boolean } = {
      [name]: evt.target.checked,
    };

    this.setState(state);
  };

  private getFormValues(): IBodyFormData {
    const {
      name,
      short_name,
      logo,
      is_party,
      is_inactive,
      founded_at,
      terminated_at,
      link,
    } = this.state;

    return {
      founded_at,
      is_inactive: !!is_inactive,
      is_party: !!is_party,
      logo: logo || null,
      link,
      name: name || '',
      short_name,
      terminated_at,
    };
  }
}
