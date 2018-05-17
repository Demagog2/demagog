/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { debounce, truncate } from 'lodash';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import { GetBodies } from '../queries/queries';
import BodyLogo from './BodyLogo';
import Loading from './Loading';

interface IBadgeProps {
  is_party: boolean;
}

function Badge(props: IBadgeProps) {
  if (props.is_party) {
    return <span className="badge badge-primary">Politicka strana</span>;
  }

  return <span className="badge badge-secondary">Skupina</span>;
}

interface IBodiesState {
  name: string | null;
}

export default class Bodies extends React.Component<{}, IBodiesState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      name: null,
    };
  }

  private updateName = debounce((name: string) => this.setState({ name }), 500);

  public render() {
    return (
      <div>
        <h1>Strany a skupiny</h1>

        <Link style={{ marginBottom: 20 }} className="btn btn-primary" to="/admin/bodies/new">
          Přidat novou stranu / skupinu
        </Link>

        <input
          style={{ marginBottom: 20 }}
          className="form-control"
          type="search"
          placeholder="Vyhledat politickou stranu nebo skupinu"
          onChange={(evt) => this.updateName(evt.target.value)}
        />

        <Query query={GetBodies} variables={{ name: this.state.name }}>
          {(props) => {
            if (props.loading) {
              return <Loading />;
            }

            if (props.error) {
              return <h1>{props.error}</h1>;
            }

            return (
              <div>
                {props.data.bodies.map((body) => (
                  <div className="card" key={body.id} style={{ marginBottom: '1rem' }}>
                    <Link
                      to={`/admin/bodies/edit/${body.id}`}
                      style={{
                        height: '100%',
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                      }}
                    />

                    <div className="card-body" style={{ display: 'flex' }}>
                      <div style={{ flex: '0 0 106px' }}>
                        <BodyLogo logo={body.logo} name={body.name} />
                      </div>

                      <div style={{ marginLeft: 15 }}>
                        <h5 className="card-title">
                          {body.name} ({body.short_name})
                        </h5>

                        <div className="card-subtitle">
                          <Badge is_party={body.is_party} />
                        </div>

                        <p className="card-text">{truncate(body.description, { length: 180 })}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
