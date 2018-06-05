import * as React from 'react';
import { v4 as uuid } from 'uuid';

import { pick } from 'lodash';
import { Query } from 'react-apollo';
import { GetSpeakerBodiesQuery } from '../../operation-result-types';
import { GetSpeakersBodies } from '../../queries/queries';
import Loading from '../Loading';
import { IMembership, MembershipInput } from './controls/MembershipInput';

type OutputMembership = Pick<IMembership, 'id' | 'body' | 'until' | 'since'>;

function createMembership(bodyId: string): IMembership {
  return {
    key: uuid(),
    id: null,
    body: {
      id: bodyId,
    },
    since: null,
    until: null,
  };
}

interface IMembershipFormState {
  memberships: IMembership[];
}

interface IMembershipFormProps {
  memberships: OutputMembership[];
  onChange(memberships: OutputMembership[]): void;
}

export class MembershipForm extends React.Component<IMembershipFormProps, IMembershipFormState> {
  constructor(props: IMembershipFormProps) {
    super(props);

    this.state = {
      // We have to construct membership manually as Apollo adds __typename prop
      // which causes propblems when saving.
      memberships: props.memberships.map((membership: OutputMembership) => ({
        key: uuid(),
        body: pick(membership.body, ['id']),
        ...pick(membership, ['id', 'since', 'until']),
      })),
    };
  }

  public render() {
    return (
      <Query query={GetSpeakersBodies}>
        {({ data, loading }) => {
          if (loading) {
            return <Loading />;
          }

          if (!data) {
            return null;
          }

          return (
            <React.Fragment>
              {this.state.memberships.map((m) => (
                <MembershipInput
                  key={m.key}
                  membership={m}
                  bodies={data.bodies}
                  onRemove={this.removeMembership(m.key)}
                  onChange={this.updateMembership(m.key)}
                />
              ))}
              <button
                type="button"
                onClick={this.addMembership(data)}
                className="btn btn-secondary"
              >
                Přidat příslušnost ke straně nebo skupině
              </button>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }

  private onChange = (memberships: IMembership[]) => {
    this.props.onChange(
      memberships.map((membership) => {
        // Drop prop key
        const { key, ...outputMembership } = membership;
        return outputMembership;
      }),
    );
  };

  private addMembership = (bodiesQuery: GetSpeakerBodiesQuery) => (evt) => {
    const defaultBody = bodiesQuery.bodies[0];

    const memberships = [...this.state.memberships, createMembership(defaultBody.id)];

    this.setState({ memberships });

    evt.preventDefault();

    this.onChange(memberships);
  };

  private removeMembership = (removedKey: string) => (evt) => {
    const memberships = this.state.memberships.filter((membership) => {
      return membership.key !== removedKey;
    });

    this.setState({ memberships });

    evt.preventDefault();

    this.onChange(memberships);
  };

  private updateMembership = (updatedKey: string) => (updatedMembership: IMembership) => {
    const memberships = this.state.memberships.map((membership) => {
      if (membership.key === updatedKey) {
        return {
          key: updatedKey,
          ...updatedMembership,
        };
      }

      return membership;
    });

    this.setState({ memberships });

    this.onChange(memberships);
  };
}
