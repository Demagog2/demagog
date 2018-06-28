import * as React from 'react';

import { shallow } from 'enzyme';

import { BodyForm } from '../BodyForm';

describe('BodyForm', () => {
  it.skip('should toggle Party related fields on "is party" flag', () => {
    const component = shallow(
      <BodyForm onSubmit={jest.fn()} submitting={false} title="Body form" />,
    );

    component.find('.s-is_party').simulate('change', { target: { checked: false } });

    const partyRelatedFormFields = [
      '.s-short_name',
      '.s-link',
      '.s-founded_at',
      '.s-terminated_at',
    ];

    partyRelatedFormFields.forEach((formField) => {
      expect(component.find(formField)).toHaveLength(0);
    });

    component.find('.s-is_party').simulate('change', { target: { checked: true } });

    partyRelatedFormFields.forEach((formField) => {
      expect(component.find(formField)).toHaveLength(1);
    });
  });
});
