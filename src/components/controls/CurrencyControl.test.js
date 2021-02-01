import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import CurrencyControl from './CurrencyControl';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

describe('CurrencyControl', () => { 
  it('should render base', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A currency control',
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<CurrencyControl control={control}/>);
    getAllByText('A currency control');
    const ele = getByLabelText('A currency control');
    expect(ele.value).toEqual('');
  });
  it('should render with default value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A currency control',
      default: 3
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<CurrencyControl control={control}/>);
    getAllByText('A currency control');
    const ele = getByLabelText('A currency control');
    expect(ele.value).toEqual('$3');
  });
  it('should render with value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A currency control'
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<CurrencyControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '5.00'
          }
        }
      }
    });
    getAllByText('A currency control');
    const ele = getByLabelText('A currency control');
    expect(ele.value).toEqual('$5.00');
  });
  it('should allow change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A currency control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<CurrencyControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '5'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A currency control'));
    const ele = getByLabelText('A currency control');
    expect(ele.value).toEqual('$5');
    userEvent.clear(ele);
    userEvent.type(ele, '3');
    expect(ele.value).toEqual('$3');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '3'
          }
        }
      }, expect.anything())
    });
  });
  it('should allow negatative value if required', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A currency control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<CurrencyControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '5'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A currency control'));
    const ele = getByLabelText('A currency control');
    expect(ele.value).toEqual('$5');
    userEvent.clear(ele);
    userEvent.type(ele, '-3');
    expect(ele.value).toEqual('-$3');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '-3'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent negatative value if required', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A currency control',
      minValue: '0.0'
    };
    const { debug,  getByLabelText, getByText } = formRender(<CurrencyControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '5'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A currency control'));
    const ele = getByLabelText('A currency control');
    expect(ele.value).toEqual('$5');
    userEvent.clear(ele);
    userEvent.type(ele, '-3');
    expect(ele.value).toEqual('$3');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '3'
          }
        }
      }, expect.anything())
    });
  });
  it('should render thousands', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A currency control'
    };
    const { debug,  getByLabelText, getByText } = formRender(<CurrencyControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '5'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A currency control'));
    const ele = getByLabelText('A currency control');
    expect(ele.value).toEqual('$5');
    userEvent.clear(ele);
    userEvent.type(ele, '1000');
    expect(ele.value).toEqual('$1,000');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '1000'
          }
        }
      }, expect.anything())
    });
  });
  it('should ignore non-numeric change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A currency control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<CurrencyControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '5'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A currency control'));
    const ele = getByLabelText('A currency control');
    expect(ele.value).toEqual('$5');
    userEvent.clear(ele);
    userEvent.type(ele, 'abc');
    expect(ele.value).toEqual('');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: ''
          }
        }
      }, expect.anything())
    });
  });
  it('should change in sub relationship', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A currency control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<CurrencyControl control={control} entity={'child'} count={0}/>, {
      formRecord : {
        global: {
        },
        child: {
          instances: [{
            attr1: {
              value: '5'
            }
          }]
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A currency control'));
    const ele = getByLabelText('A currency control');
    expect(ele.value).toEqual('$5');
    userEvent.clear(ele);
    userEvent.type(ele, '3');
    expect(ele.value).toEqual('$3');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
        },
        child: {
          instances: [{
            attr1: {
              value: '3'
            }
          }]
        }
      }, expect.anything())
    });
  });
  it('should handle i18n', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A currency control',
    };
    const { debug,  getAllByText } = formRender(<CurrencyControl control={control}/>, {
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
            'A currency control': 'Le currency control'
          }
        }
      }
    });
    getAllByText('Le currency control');
  });
  it('should hide if state is hidden', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A currency control',
      state: 'hidden'
    };
    const { debug,  getByText } = formRender(<CurrencyControl control={control}/>,{
      formRecord : {
        global: {
          attr1: {
            value: '5'
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getByText('A currency control')).toThrow();
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '5'
          }
        }
      }, expect.anything())
    });
  });
  it('should hide if state is hidden and default will not change the value', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A currency control',
      state: 'hidden',
      default: 3
    };
    const { debug,  getByText } = formRender(<CurrencyControl control={control}/>,{
      formRecord : {
        global: {
          attr1: {
            value: null
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getByText('A currency control')).toThrow();
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
      label: 'A currency control',
      errors: ['Required']
    };
    const { debug,  getByText } = formRender(<CurrencyControl control={control}/>);
    getByText('Required');
  });
  it('should show multiple errors', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A currency control',
      errors: ['Required', 'Missing']
    };
    const { debug,  getByText } = formRender(<CurrencyControl control={control}/>);
    getByText('Required');
    getByText('Missing');
  });
});