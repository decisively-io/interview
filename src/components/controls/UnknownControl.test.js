import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import UnknownControl from './UnknownControl';
import userEvent from '@testing-library/user-event'
import moment from 'moment';

afterEach(cleanup);

describe('UnknownControl', () => { 
  it('should render base', () => {
    const control = {
      type: 'unknown',
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<UnknownControl control={control}/>);
    getAllByText('Unknown Control: unknown');
  });
  it('should not change submission', async () => {
    const submitHandler = jest.fn();
    const control = {
      type: 'unknown',
      value: '1',
      attributeId: 'attr1'
    };
    const { debug,  getByText } = formRender(<UnknownControl control={control}/>,{
      formRecord : {
        global: {
          attr1: {
            value: 'hello'
          }
        }
      },
      submitHandler : submitHandler
    });
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: 'hello'
          }
        }
      }, expect.anything())
    });
  });
});