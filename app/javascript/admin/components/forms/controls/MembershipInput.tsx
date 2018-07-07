import * as React from 'react';

import { Button, Classes, FormGroup } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import DateInput from './DateInput2';

export interface IMembership {
  key: string;
  id?: string | null;
  body: {
    id: string;
  };
  since?: string | null;
  until?: string | null;
}

interface IMembershipFormProps {
  membership: IMembership;
  bodies: Array<{
    id: string;
    name: string;
    short_name: string;
    is_inactive: boolean;
    terminated_at: string | null;
  }>;

  onChange?(membership: IMembership): void;
  onRemove?(): void;
}

interface IMembershipFormState {
  body_id?: string;
  since?: string;
  until?: string;
}

export class MembershipInput extends React.Component<IMembershipFormProps, IMembershipFormState> {
  constructor(props: IMembershipFormProps) {
    super(props);

    this.state = {
      body_id: props.membership.body.id,
      since: props.membership.since || undefined,
      until: props.membership.until || undefined,
    };
  }

  private onChange = (change: Partial<IMembershipFormState>) => {
    this.setState(change, () => {
      if (this.props.onChange) {
        this.props.onChange({
          ...this.props.membership,
          since: this.state.since || null,
          until: this.state.until || null,
          body: {
            id: this.state.body_id || '',
          },
        });
      }
    });
  };

  private onBodyChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const bodyId = evt.target.value;
    let until = this.state.until;

    // If the selected body is inactive, prefill the end of membership to the
    // date of body termination
    const body = this.props.bodies.find((b) => b.id === bodyId);
    if (body && body.is_inactive && body.terminated_at && !until) {
      until = body.terminated_at;
    }

    this.onChange({ body_id: bodyId, until });
  };

  private onDateChange = (name: string) => (value: string) => {
    this.onChange({ [name]: value });
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '5 5' }}>
          <FormGroup label="Strana/skupina" labelFor="body">
            <div className={Classes.SELECT}>
              <select id="body" name="body" onChange={this.onBodyChange} value={this.state.body_id}>
                {this.props.bodies.map((body) => (
                  <option key={body.id} value={body.id}>
                    {body.name} ({body.short_name})
                  </option>
                ))}
              </select>
            </div>
          </FormGroup>
        </div>

        <div style={{ flex: '3 3', marginLeft: 15 }}>
          <FormGroup label="Od" labelFor="since">
            <DateInput
              id="since"
              value={this.state.since || null}
              onChange={this.onDateChange('since')}
            />
          </FormGroup>
        </div>

        <div style={{ flex: '3 3', marginLeft: 15 }}>
          <FormGroup label="Do" labelFor="until">
            <DateInput
              id="until"
              value={this.state.until || null}
              onChange={this.onDateChange('until')}
            />
          </FormGroup>
        </div>

        <div style={{ flex: '1 1', marginLeft: 15, paddingTop: 15 }}>
          <Button
            icon={IconNames.TRASH}
            onClick={this.props.onRemove}
            minimal
            title="Odstranit příslušnost"
          />
        </div>
      </div>
    );
  }
}
