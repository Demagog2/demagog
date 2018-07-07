/* eslint camelcase: 0 */

import * as React from 'react';

import { Button, Classes, FormGroup, Intent, Switch } from '@blueprintjs/core';
import * as classNames from 'classnames';
import { Link } from 'react-router-dom';

import { BodyInputType, GetBodyQuery } from '../../operation-result-types';
import BodyLogo from '../BodyLogo';
import DateInput from './controls/DateInput2';
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
        {({ onAssociationChange, onInputChange, onCheckboxChange, onImageChange }, data) => (
          <div>
            <div style={{ float: 'right' }}>
              <Link to="/admin/bodies" className={Classes.BUTTON}>
                Zpět
              </Link>
              <Button
                type="submit"
                intent={Intent.PRIMARY}
                style={{ marginLeft: 7 }}
                disabled={submitting}
                text={submitting ? 'Ukládám ...' : 'Uložit'}
              />
            </div>

            <h2>{title}</h2>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                <h4>Základní údaje</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup label="Název" labelFor="name">
                  <input
                    type="text"
                    id="name"
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    onChange={onInputChange('name')}
                    defaultValue={bodyQuery.body.name}
                  />
                </FormGroup>
                <FormGroup label="Zkrácený název" labelFor="short-name">
                  <input
                    type="text"
                    id="short-name"
                    className={Classes.INPUT}
                    onChange={onInputChange('short_name')}
                    defaultValue={bodyQuery.body.short_name || ''}
                  />
                </FormGroup>
                <FormGroup
                  label="Respekovaný odkaz obsahující popis (wikipedia, nasipolitici, atp.)"
                  labelFor="link"
                >
                  <input
                    type="text"
                    id="link"
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    onChange={onInputChange('link')}
                    defaultValue={bodyQuery.body.link || ''}
                  />
                </FormGroup>
                <FormGroup label="Logo">
                  <ImageInput
                    defaultValue={bodyQuery.body.logo}
                    onChange={onImageChange('logo')}
                    renderImage={(src) => <BodyLogo logo={src} />}
                  />
                </FormGroup>
                <Switch
                  name="is-party"
                  label="Jde o politickou stranu"
                  onChange={onCheckboxChange('is_party')}
                  defaultChecked={bodyQuery.body.is_party}
                />
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                <h4>Vznik a zánik</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup label="Datum vzniku" labelFor="founded-at">
                  <DateInput
                    id="founded-at"
                    value={data.founded_at || null}
                    onChange={onAssociationChange('founded_at')}
                  />
                </FormGroup>
                <Switch
                  name="is-inactive"
                  label="Skupina zanikla / není aktivní"
                  onChange={onCheckboxChange('is_inactive')}
                  defaultChecked={bodyQuery.body.is_inactive}
                />
                <FormGroup label="Datum zániku" labelFor="terminated-at">
                  <DateInput
                    disabled={!data.is_inactive}
                    id="terminated-at"
                    value={data.terminated_at || null}
                    onChange={onAssociationChange('terminated_at')}
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        )}
      </BodyInternalForm>
    );
  }
}
