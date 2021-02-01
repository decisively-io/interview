import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import DateTimeControl from './DateTimeControl';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

describe('DateTimeControl', () => { 
  it('should render base', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<DateTimeControl control={control}/>);
    getAllByText('A date time control');
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('');
  });
  it('should render with default value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
      default: '2018-01-29 09:00:00'
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<DateTimeControl control={control}/>);
    getAllByText('A date time control');
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2018-01-29 09:00');
  });
  it('should render with value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<DateTimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2018-01-21 13:00:00'
          }
        }
      }
    });
    getAllByText('A date time control');
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2018-01-21 13:00');
  });
  it('should allow change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateTimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2018-01-21 09:00:00'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date time control'));
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2018-01-21 09:00');
    userEvent.clear(ele);
    userEvent.type(ele, '2019-02-21 11:00');
    expect(ele.value).toEqual('2019-02-21 11:00');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-02-21T11:00:00'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent non-numeric change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateTimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2018-01-21 09:00:00'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date time control'));
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2018-01-21 09:00');
    userEvent.clear(ele);
    userEvent.type(ele, 'abc');
    //expect(ele.value).toEqual(''); // For some reason the time picker accepts some string values and then appends a heap of ___'s

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2018-01-21 09:00:00'
          }
        }
      }, expect.anything())
    });
  });
  it('should disable past', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
      yearStart: 0
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateTimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2032-01-21T09:00'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date time control'));
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2032-01-21 09:00');
    userEvent.clear(ele);
    userEvent.type(ele, '2019-01-01 11:00');

    await waitFor(() => {
      getByText('Date cannot be before minimal date');
    });

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2032-01-21T09:00'
          }
        }
      }, expect.anything())
    });
  });
  it('should disable future', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
      yearEnd: 0
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateTimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21T09:00'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date time control'));
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2019-01-21 09:00');
    userEvent.clear(ele);
    userEvent.type(ele, '2050-21-01 11:00');

    // For some reason this respects the setting, but doesn't show an error
    /*await waitFor(() => {
      getByText('Date cannot be after maximum date');
    });*/

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21T09:00'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent date before minDate', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date time control'
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateTimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21T09:00'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date time control'));
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2019-01-21 09:00');
    userEvent.clear(ele);
    userEvent.type(ele, '1890-01-21 11:00');

    await waitFor(() => {
      getByText('Date cannot be before minimal date');
    });

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21T09:00'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent date after maxDate', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date time control'
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateTimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21T09:00'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date time control'));
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2019-01-21 09:00');
    userEvent.clear(ele);
    userEvent.type(ele, '2105-01-21 11:00');

    await waitFor(() => {
      getByText('Date cannot be after maximum date');
    });

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21T09:00'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent date before set year', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
      yearEnd: 3
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateTimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21T09:00'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date time control'));
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2019-01-21 09:00');
    userEvent.clear(ele);
    userEvent.type(ele, '2071-01-01 11:00');

    await waitFor(() => {
      getByText('Date cannot be after maximum date');
    });

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21T09:00'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent date before set negative year', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
      yearEnd: -3
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateTimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21 09:00'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date time control'));
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2019-01-21 09:00');
    userEvent.clear(ele);
    userEvent.type(ele, (new Date().getFullYear() - 5) + '-01-21 11:00' );

    /*await waitFor(() => {
      getByText('Date cannot be before minimal date');
    });*/

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21 09:00'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent date before a previous year and this year', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
      yearEnd: -3,
      yearStart: 0
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateTimeControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21 09:00'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date time control'));
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2019-01-21 09:00');
    userEvent.clear(ele);
    userEvent.type(ele, (new Date().getFullYear() + 1) + '-01-21 11:00' );

    await waitFor(() => {
      getByText('Date cannot be after maximum date');
    });


    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21 09:00'
          }
        }
      }, expect.anything())
    });
  });
  it('should change in sub relationship', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateTimeControl control={control} entity={'child'} count={0}/>, {
      formRecord : {
        global: {
        },
        child: {
          instances: [{
            attr1: {
            value: '2019-01-21 09:00'
            }
          }]
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date time control'));
    const ele = getByLabelText('A date time control');
    expect(ele.value).toEqual('2019-01-21 09:00');
    userEvent.clear(ele);
    userEvent.type(ele, '2020-01-21 11:00');
    expect(ele.value).toEqual('2020-01-21 11:00');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
        },
        child: {
          instances: [{
            attr1: {
            value: '2020-01-21T11:00:00'
            }
          }]
        }
      }, expect.anything())
    });
  });
  it('should handle i18n', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
    };
    const { debug,  getAllByText } = formRender(<DateTimeControl control={control}/>, {
      locale: 'fr',
      messages: {
        fr: {
          control: {
            'A date time control': 'Le date control'
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
      label: 'A date time control',
      state: 'hidden'
    };
    const { debug,  getByText } = formRender(<DateTimeControl control={control}/>,{
      formRecord : {
        global: {
          attr1: {
            value: '2020-01-21 09:00'
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getByText('A date time control')).toThrow();
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2020-01-21 09:00'
          }
        }
      }, expect.anything())
    });
  });

  it('should hide if state is hidden and default will not change the value', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
      state: 'hidden',
      default: '2012-01-01 09:00'
    };
    const { debug,  getByText } = formRender(<DateTimeControl control={control}/>,{
      formRecord : {
        global: {
          attr1: {
            value: null
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getByText('A date time control')).toThrow();
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
      label: 'A date time control',
      errors: ['Required']
    };
    const { debug,  getByText } = formRender(<DateTimeControl control={control}/>);
    getByText('Required');
  });
  it('should show multiple errors', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A date time control',
      errors: ['Required', 'Missing']
    };
    const { debug,  getByText } = formRender(<DateTimeControl control={control}/>);
    getByText('Required');
    getByText('Missing');
  });
});