import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import DateControl from './DateControl';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

describe('DateControl', () => { 
  it('should render base', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<DateControl control={control}/>);
    getAllByText('A date control');
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('');
  });
  it('should render with default value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
      default: '2018-01-29'
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<DateControl control={control}/>);
    getAllByText('A date control');
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('29/01/2018');
  });
  it('should render with value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
    };
    const { debug,  getAllByText, getByLabelText } = formRender(<DateControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2018-01-21'
          }
        }
      }
    });
    getAllByText('A date control');
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('21/01/2018');
  });
  it('should allow change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2018-01-21'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date control'));
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('21/01/2018');
    userEvent.clear(ele);
    userEvent.type(ele, '21/02/2019');
    expect(ele.value).toEqual('21/02/2019');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-02-21'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent non-numeric change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2018-01-21'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date control'));
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('21/01/2018');
    userEvent.clear(ele);
    userEvent.type(ele, 'type');
    expect(ele.value).toEqual('');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2018-01-21'
          }
        }
      }, expect.anything())
    });
  });
  it('should disable past', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
      yearStart: 0
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2022-01-21'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date control'));
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('21/01/2022');
    userEvent.clear(ele);
    userEvent.type(ele, '21/01/2019');

    await waitFor(() => {
      getByText('Date cannot be before minimal date');
    });

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2022-01-21'
          }
        }
      }, expect.anything())
    });
  });
  it('should disable future', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
      yearEnd: 0
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date control'));
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('21/01/2019');
    userEvent.clear(ele);
    userEvent.type(ele, '21/01/2050');

    await waitFor(() => {
      getByText('Date cannot be after maximum date');
    });

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent date before minDate', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date control'
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date control'));
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('21/01/2019');
    userEvent.clear(ele);
    userEvent.type(ele, '21/01/1890');

    await waitFor(() => {
      getByText('Date cannot be before minimal date');
    });

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent date after maxDate', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date control'
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date control'));
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('21/01/2019');
    userEvent.clear(ele);
    userEvent.type(ele, '21/01/2105');

    await waitFor(() => {
      getByText('Date cannot be after maximum date');
    });

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent date before set year', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
      yearEnd: 3
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date control'));
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('21/01/2019');
    userEvent.clear(ele);
    userEvent.type(ele, '21/01/2071');

    await waitFor(() => {
      getByText('Date cannot be after maximum date');
    });

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent date before set negative year', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
      yearEnd: -3
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date control'));
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('21/01/2019');
    userEvent.clear(ele);
    userEvent.type(ele, '21/01/' + (new Date().getFullYear() - 5));

    await waitFor(() => {
      getByText('Date cannot be before minimal date');
    });

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      }, expect.anything())
    });
  });
  it('should prevent date before a previous year and this year', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
      yearEnd: -3,
      yearStart: 0
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date control'));
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('21/01/2019');
    userEvent.clear(ele);
    userEvent.type(ele, '21/01/' + (new Date().getFullYear() + 1));

    await waitFor(() => {
      getByText('Date cannot be after maximum date');
    });


    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2019-01-21'
          }
        }
      }, expect.anything())
    });
  });
  it('should change in sub relationship', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<DateControl control={control} entity={'child'} count={0}/>, {
      formRecord : {
        global: {
        },
        child: {
          instances: [{
            attr1: {
              value: '2019-01-21'
            }
          }]
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A date control'));
    const ele = getByLabelText('A date control');
    expect(ele.value).toEqual('21/01/2019');
    userEvent.clear(ele);
    userEvent.type(ele, '21/01/2020');
    expect(ele.value).toEqual('21/01/2020');

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
        },
        child: {
          instances: [{
            attr1: {
              value: '2020-01-21'
            }
          }]
        }
      }, expect.anything())
    });
  });
  it('should handle i18n', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
    };
    const { debug,  getAllByText } = formRender(<DateControl control={control}/>, {
      locale: 'fr',
      messages: {
        fr: {
          control: {
            'A date control': 'Le date control'
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
      label: 'A date control',
      state: 'hidden'
    };
    const { debug,  getByText } = formRender(<DateControl control={control}/>,{
      formRecord : {
        global: {
          attr1: {
            value: '2020-01-21'
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getByText('A date control')).toThrow();
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: '2020-01-21'
          }
        }
      }, expect.anything())
    });
  });

  it('should hide if state is hidden and default will not change the value', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
      state: 'hidden',
      default: '21/01/2012'
    };
    const { debug,  getByText } = formRender(<DateControl control={control}/>,{
      formRecord : {
        global: {
          attr1: {
            value: null
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getByText('A date control')).toThrow();
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
      label: 'A date control',
      errors: ['Required']
    };
    const { debug,  getByText } = formRender(<DateControl control={control}/>);
    getByText('Required');
  });
  it('should show multiple errors', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A date control',
      errors: ['Required', 'Missing']
    };
    const { debug,  getByText } = formRender(<DateControl control={control}/>);
    getByText('Required');
    getByText('Missing');
  });
});