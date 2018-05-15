import * as React from 'react';

import * as GO from 'react-icons/lib/go';

export interface IMembership {
  key: string;
  id: string | null;
  body_id: string;
  since: string | null;
  until: string | null;
}

interface IMembershipFormProps {
  membership: IMembership;
  bodies: Array< {
    id: string,
    name: string,
    short_name: string,
    is_inactive: boolean,
    terminated_at: string | null
  } >;

  onChange?(membership: IMembership): void;
  onRemove?(evt: React.MouseEvent<React.ReactSVGElement>): void;
}

interface IMembershipFormState {
  body_id?: string;
  since?: string;
  until?: string;
}

export class MembershipForm extends React.Component<IMembershipFormProps, IMembershipFormState> {
  constructor(props: IMembershipFormProps) {
    super(props);

    this.state = {
      body_id: props.membership.body_id,
      since: props.membership.since || undefined,
      until: props.membership.until || undefined,
    };
  }

  private onChange = (change: Partial<IMembershipFormState>) => {
    this.setState(change, () => {
      if (this.props.onChange) {
        this.props.onChange({
          ...this.props.membership,
          body_id: this.state.body_id || '',
          since: this.state.since || null,
          until: this.state.until || null,
        });
      }
    });
  };

  private onBodyChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const body_id = evt.target.value;
    let until = this.state.until

    // If the selected body is inactive, prefill the end of membership to the
    // date of body termination
    const body = this.props.bodies.find(body => body.id === body_id);
    if (body && body.is_inactive && body.terminated_at && !until) {
      until = body.terminated_at;
    }

    this.onChange({ body_id, until });
  };

  private onDateChange = (name: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.onChange({ [name]: evt.target.value });
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    return (
      <div className="form-row">
        <div className="form-group col-md-5">
          <label htmlFor="illustration">Příslušnost ke skupině:</label>
          <select
            name="body"
            className="custom-select"
            onChange={this.onBodyChange}
            value={this.state.body_id}
          >
            {this.props.bodies.map((body) => (
              <option key={body.id} value={body.id}>
                {body.name} ({body.short_name})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group col-md-3">
          <label htmlFor="since">Od:</label>
          <input
            type="date"
            className="form-control"
            id="since"
            placeholder="Zadejte datum"
            onChange={this.onDateChange('since')}
            value={this.state.since}
          />
        </div>

        <div className="form-group col-md-3">
          <label htmlFor="until">Do:</label>
          <input
            type="date"
            className="form-control"
            id="until"
            placeholder="Zadejte datum"
            onChange={this.onDateChange('until')}
            value={this.state.until}
          />
        </div>

        <div className="form-group col-md-1">
          <br />
          <GO.GoTrashcan style={{ cursor: 'pointer' }} onClick={this.props.onRemove} />
        </div>
      </div>
    );
  }
}
