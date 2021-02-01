import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import TimeControl from './TimeControl';
import userEvent from '@testing-library/user-event'
import moment from 'moment';

afterEach(cleanup);

// Need to validate real world time input of these tests. Not sure if OPA expects a time or datetime format
describe('TimeControl', () => { 
  it('should render base', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A time control',
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<TimeControl control={control}/>);
    getAllByText('A time control');
    const ele = getByLabelText('A time control');
    expect(ele.value).toEqual('');
  });
  it('should render with default value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A time control',
      default: '2020-01-01T09:00:00'
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<TimeControl control={control}/>);
    getAllByText('A time control');
    const ele = getByLabelText('A time control');
    expect(ele.value).toEqual('09:00 AM');
  });
  it('should render with value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A time control',
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<TimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2020-01-01T13:00:00'
          }
        }
      }
    });
    getAllByText('A time control');
    const ele = getByLabelText('A time control');
    expect(ele.value).toEqual('01:00 PM');
  });
  it('should allow change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A time control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<TimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2020-01-01T09:00:00'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A time control'));
    const ele = getByLabelText('A time control');
    expect(ele.value).toEqual('09:00 AM');
    userEvent.clear(ele);
    userEvent.type(ele, '1100A');
    expect(ele.value).toEqual('11:00 AM');

    userEvent.click(getByText('Submit'));

    const today = moment().format('YYYY-MM-DD');
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: today + 'T11:00:00'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent non-numeric change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A time control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<TimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2018-01-21T09:00:00'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A time control'));
    const ele = getByLabelText('A time control');
    expect(ele.value).toEqual('09:00 AM');
    userEvent.clear(ele);
    userEvent.type(ele, 'abc');
    //expect(ele.value).toEqual(''); // For some reason the time picker accepts some string values and then appends a heap of ___'s

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2018-01-21T09:00:00'
          }
        }
      }, expect.anything())
    });
  });
  
  it('should change in sub relationship', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A time control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<TimeControl control={control} entity={'child'} count={0}/>, {
      formRecord : {
        global: {
        },
        child: {
          instances: [{
            attr1: {
            value: '2019-01-21T09:00:00'
            }
          }]
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A time control'));
    const ele = getByLabelText('A time control');
    expect(ele.value).toEqual('09:00 AM');
    userEvent.clear(ele);
    userEvent.type(ele, '11:00 PM');
    expect(ele.value).toEqual('11:00 PM');

    userEvent.click(getByText('Submit'));
    
    const today = moment().format('YYYY-MM-DD');
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
        },
        child: {
          instances: [{
            attr1: {
            value: today + 'T23:00:00'
            }
          }]
        }
      }, expect.anything())
    });
  });
  it('should handle i18n', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A time control',
    };
    const { debug,  getAllByText } = formRender(<TimeControl control={control}/>, {
      locale: 'fr',
      messages: {
        fr: {
          control: {
            'A time control': 'Le date control'
          }
        }
      }
    });
    getAllByText('Le date control');
  });
  it('should hide if state is hidden', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A time control',
      state: 'hidden'
    };
    const { debug,  getByText } = formRender(<TimeControl control={control}/>,{
      formRecord : {
        global: {
          attr1: {
            value: '2020-01-21T09:00:00'
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getByText('A time control')).toThrow();
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2020-01-21T09:00:00'
          }
        }
      }, expect.anything())
    });
  });

  it('should hide if state is hidden and default will not change the value', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A time control',
      state: 'hidden',
      default: '2012-01-01T09:00:00'
    };
    const { debug,  getByText } = formRender(<TimeControl control={control}/>,{
      formRecord : {
        global: {
          attr1: {
            value: null
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getByText('A time control')).toThrow();
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: null
          }
        }
      }, expect.anything())
    });
  });
  it('should show errors', () => {
     const control = {
      attributeId: 'attr1',
      label: 'A time control',
      errors: ['Required']
    };
    const { debug,  getByText } = formRender(<TimeControl control={control}/>);
    getByText('Required');
  });
  it('should show multiple errors', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A time control',
      errors: ['Required', 'Missing']
    };
    const { debug,  getByText } = formRender(<TimeControl control={control}/>);
    getByText('Required');
    getByText('Missing');
  });
});