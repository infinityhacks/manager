import * as React from 'react';
import { storiesOf } from '@storybook/react';

import ErrorState from './ErrorState';

storiesOf('Error Display', module)
  .add('with text', () => (
    <ErrorState errorText="An error has occured." />
  ));
