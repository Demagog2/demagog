import * as React from 'react';

import { ApolloError } from '@apollo/client';

interface IErrorProps {
  error: ApolloError;
}

export default function Error(props: IErrorProps) {
  return (
    <div>
      <h1>
        Opsy, Daisy{' '}
        <span role="img" aria-label="crying-face">
          😭
        </span>
      </h1>

      <p>{props.error.toString()}</p>
    </div>
  );
}
