import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import ImageControl from './ImageControl';
import userEvent from '@testing-library/user-event'
import moment from 'moment';

afterEach(cleanup);

describe('Image Control', () => { 
  it('should render base', () => {
    const control = {
      image: 'abc',
    };
    const { debug,  getByRole } = formRender(<ImageControl control={control}/>);
    getByRole('img');
  });
  it('should render null if no image', () => {
    const control = {

    };
    const { debug,  getByRole } = formRender(<ImageControl control={control}/>);
    expect(() => getByRole('img')).toThrow();
  });
  it('should not change submission', async () => {
    const submitHandler = jest.fn();
    const control = {
      image: 'abc',
      value: '1',
      attributeId: 'attr1'
    };
    const { debug,  getByText } = formRender(<ImageControl control={control}/>,{
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