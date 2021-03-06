import { mount } from 'enzyme';
import React from 'react';
import { push } from 'react-router-redux';
import sinon from 'sinon';

import { RebuildPage } from '~/linodes/linode/layouts/RebuildPage';

import {
  changeInput, expectDispatchOrStoreErrors, expectRequest,
} from '~/test.helpers';
import { api } from '~/data';
import { testLinode } from '~/data/linodes';
import { apiTestImage } from '~/data/images';

describe('linodes/linode/layouts/RebuildPage', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  it.skip('rebuilds the linode', async () => {
    const dispatch = sandbox.spy();
    const page = mount(
      <RebuildPage
        dispatch={dispatch}
        images={api.images.images}
        linode={testLinode}
        image={apiTestImage}
      />
    );

    changeInput(page, 'image', 'linode/debian7');
    changeInput(page, 'password', 'new password');

    dispatch.reset();
    await page.find('Form').props().onSubmit();

    expect(dispatch.callCount).toBe(1);
    const modal = mount(dispatch.firstCall.args[0].body);

    dispatch.reset();
    await modal.props().onSubmit();

    expect(dispatch.callCount).toBe(2);
    await expectDispatchOrStoreErrors(dispatch.firstCall.args[0], [
      ([fn]) => expectRequest(fn, '/linode/instances/1234/rebuild', {
        method: 'POST',
        body: {
          image: 'linode/debian7',
          root_pass: 'new password',
        },
      }, {
        ...testLinode,
        disks: testLinode._disks,
        configs: testLinode._configs,
      }),
      ([pushResult]) => expect(pushResult).toEqual(push('/linodes/test-linode')),
    ]);
  });
});
