import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import TextControl from './TextControl';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

describe('TextControl', () => { 
  it('should render base', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A text control',
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<TextControl control={control}/>);
    getAllByText('A text control');
    const ele = getByLabelText('A text control');
    expect(ele.value).toEqual('');
  });
  it('should render with default value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A text control',
      default: 'test'
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<TextControl control={control}/>);
    getAllByText('A text control');
    const ele = getByLabelText('A text control');
    expect(ele.value).toEqual('test');
  });
  it('should render with value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A text control'
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<TextControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: 'test'
          }
        }
      }
    });
    getAllByText('A text control');
    const ele = getByLabelText('A text control');
    expect(ele.value).toEqual('test');
  });
  it('should allow change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A text control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<TextControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: 'test'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A text control'));
    const ele = getByLabelText('A text control');
    expect(ele.value).toEqual('test');
    userEvent.clear(ele);
    userEvent.type(ele, 'abc');
    expect(ele.value).toEqual('abc');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: 'abc'
          }
        }
      }, expect.anything())
    });
  });
  
  it('should change in sub relationship', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A text control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<TextControl control={control} entity={'child'} count={0}/>, {
      formRecord : {
        global: {
        },
        child: {
          instances: [{
            attr1: {
              value: 'test'
            }
          }]
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A text control'));
    const ele = getByLabelText('A text control');
    expect(ele.value).toEqual('test');
    userEvent.clear(ele);
    userEvent.type(ele, 'abc');
    expect(ele.value).toEqual('abc');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
        },
        child: {
          instances: [{
            attr1: {
              value: 'abc'
            }
          }]
        }
      }, expect.anything())
    });
  });
  it('should handle i18n', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A text control',
    };
    const { debug,  getAllByText } = formRender(<TextControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '4'
          }
        }
      },
      locale: 'fr',
      messages: {
        fr: {
          control: {
            'A text control': 'Le text control'
          }
        }
      }
    });
    getAllByText('Le text control');
  });
  it('should hide if state is hidden', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A text control',
      state: 'hidden'
    };
    const { debug,  getByText } = formRender(<TextControl control={control}/>,{
      formRecord : {
        global: {
          attr1: {
            value: 'test'
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getByText('A text control')).toThrow();
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: 'test'
          }
        }
      }, expect.anything())
    });
  });
  it('should hide if state is hidden and default will not change the value', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A text control',
      state: 'hidden',
      default: 'abc'
    };
    const { debug,  getByText } = formRender(<TextControl control={control}/>,{
      formRecord : {
        global: {
          attr1: {
            value: 'test'
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getByText('A text control')).toThrow();
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: 'test'
          }
        }
      }, expect.anything())
    });
  });
  it('should show errors', () => {
     const control = {
      attributeId: 'attr1',
      label: 'A text control',
      errors: ['Required']
    };
    const { debug,  getByText } = formRender(<TextControl control={control}/>);
    getByText('Required');
  });
  it('should show multiple errors', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A text control',
      errors: ['Required', 'Missing']
    };
    const { debug,  getByText } = formRender(<TextControl control={control}/>);
    getByText('Required');
    getByText('Missing');
  });
});