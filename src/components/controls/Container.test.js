import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import Container from './Container';
import userEvent from '@testing-library/user-event'
import moment from 'moment';

afterEach(cleanup);

describe('Container Control', () => { 
  it('should render base', () => {
    const container = {
      controls: [{
        type: 'text',
        label: 'A text control'
      },{
        type: 'select',
        label: 'A select control'
      }]
    };
    const { debug,  getAllByText } = formRender(<Container container={container}/>, {
      formRecord: {
        global: {
          attr1: {
            value: 'val1'
          }
        }
      }
    });
    getAllByText('A text control');
    getAllByText('A select control');
  });
  it('should render container in container', () => {
    const container = {
      controls: [{
        type: 'text',
        label: 'A text control'
      },{
        type: 'container',
        controls: [{
          type: 'select',
          label: 'A select control'
        }]
      }]
    };
    const { debug,  getAllByText } = formRender(<Container container={container}/>, {
      formRecord: {
        global: {
          attr1: {
            value: 'val1'
          }
        }
      }
    });
    getAllByText('A text control');
    getAllByText('A select control');
  });
  it('should respect hidden rules', () => {
    const container = {
      controls: [{
        type: 'text',
        label: 'A text control',
        state: 'hidden'
      },{
        type: 'select',
        label: 'A select control'
      }]
    };
    const { debug,  getAllByText } = formRender(<Container container={container}/>, {
      formRecord: {
        global: {
          attr1: {
            value: 'val1'
          }
        }
      }
    });
    expect(() => getAllByText('A text control')).toThrow();

    
    getAllByText('A select control');
  });
  it('should not change submission', async () => {
    const submitHandler = jest.fn();
    const container = {
      controls: [{
        type: 'text',
        label: 'A text control'
      },{
        type: 'select',
        label: 'A select control'
      }]
    };
    const { debug,  getByText } = formRender(<Container container={container}/>, {
      formRecord: {
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