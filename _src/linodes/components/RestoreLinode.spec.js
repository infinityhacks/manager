import { mount } from 'enzyme';
import { push } from 'react-router-redux';
import sinon from 'sinon';

import { RestoreLinode } from '~/linodes/components';

import {
  changeInput,
  expectDispatchOrStoreErrors,
  expectRequest,
} from '~/test.helpers';
import { api } from '~/data';
import { testType } from '~/data/types';
import { testLinode } from '~/data/linodes';


const { linodes: { linodes }, types: { types } } = api;

describe('linodes/components/RestoreLinode', function () {
  const sandbox = sinon.sandbox.create();
  let dispatch = sandbox.spy();

  afterEach(() => {
    sandbox.restore();
    dispatch = sandbox.spy();
  });

  it.skip('creates a new linode from a backup', async function () {
    RestoreLinode.trigger(dispatch, linodes, types);
    const modal = mount(dispatch.firstCall.args[0].body);

    changeInput(modal, 'backup', 1234);
    changeInput(modal, 'label', 'Restored from backup');
    changeInput(modal, 'plan', testType.id);
    changeInput(modal, 'linode', testLinode.id);

    dispatch.reset();

    modal.find('Form').props().onSubmit();

    await expectDispatchOrStoreErrors(dispatch.firstCall.args[0], [
      ([fn]) => expectRequest(fn, '/linode/instances/', {
        method: 'POST',
        body: {
          backup_id: 1234,
          label: 'Restored from backup',
          type: testType.id,
          backups_enabled: false,
          region: testLinode.region,
        },
      }),
      ([pushResult]) => expect(pushResult).toEqual(push('/linodes/my-linode')),
    ], 2, [{ label: 'my-linode' }]);
  });

  it.skip('creates a new linode from a backup with backups enabled', async function () {
    RestoreLinode.trigger(dispatch, linodes, types);
    const modal = mount(dispatch.firstCall.args[0].body);

    changeInput(modal, 'backup', 1235);
    changeInput(modal, 'label', 'Restored from backup');
    changeInput(modal, 'plan', testType.id);
    changeInput(modal, 'backups', true);
    changeInput(modal, 'linode', testLinode.id);

    dispatch.reset();

    modal.find('Form').props().onSubmit();

    await expectDispatchOrStoreErrors(dispatch.firstCall.args[0], [
      ([fn]) => expectRequest(fn, '/linode/instances/', {
        method: 'POST',
        body: {
          backup_id: 1235,
          label: 'Restored from backup',
          type: testType.id,
          backups_enabled: true,
          region: testLinode.region,
        },
      }),
      ([pushResult]) => expect(pushResult).toEqual(push('/linodes/my-linode')),
    ], 2, [{ label: 'my-linode' }]);
  });
});
