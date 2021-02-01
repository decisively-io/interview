import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import RadioControl from './RadioControl';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

describe('RadioControl', () => { 
  it('should render base', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A radio control',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  getAllByText, getAllByRole } = formRender(<RadioControl control={control}/>);
    getAllByText('A radio control');
    const ele = getAllByRole('radio');
    expect(ele[0].value).toEqual('val1');
    expect(ele[0].checked).toEqual(false);

    expect(ele[1].value).toEqual('val2');
    expect(ele[1].checked).toEqual(false);
  });
  it('should render default', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A radio control',
      default: 'val1',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  getAllByText, getAllByRole } = formRender(<RadioControl control={control}/>);
    getAllByText('A radio control');
    const ele = getAllByRole('radio');
    expect(ele[0].value).toEqual('val1');
    expect(ele[0].checked).toEqual(true);

    expect(ele[1].value).toEqual('val2');
    expect(ele[1].checked).toEqual(false);
  });
  it('should render value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A radio control',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  getAllByText, getAllByRole } = formRender(<RadioControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: 'val1'
          }
        }
      }
    });
    getAllByText('A radio control');
    const ele = getAllByRole('radio');
    expect(ele[0].value).toEqual('val1');
    expect(ele[0].checked).toEqual(true);

    expect(ele[1].value).toEqual('val2');
    expect(ele[1].checked).toEqual(false);
  });
  it('should allow change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A radio control',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  getAllByText, getByText, getAllByRole } = formRender(<RadioControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: 'val1'
          }
        }
      },
      submitHandler : submitHandler
    });
    getAllByText('A radio control');
    const ele = getAllByRole('radio');
    expect(ele[0].value).toEqual('val1');
    expect(ele[0].checked).toEqual(true);
    expect(ele[1].value).toEqual('val2');
    expect(ele[1].checked).toEqual(false);
    userEvent.click(ele[1]);
    expect(ele[1].checked).toEqual(true);
    expect(ele[0].checked).toEqual(false);

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: 'val2'
          }
        }
      }, expect.anything())
    });
  });
  it('should allow change with boolean', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A radio control',
      attributeType: 'boolean',
      options: [{
        value: true,
        label: 'Yes'
      },{
        value: false,
        label: 'No'
      }]
    };
    const { debug,  getAllByText, getByText, getAllByRole } = formRender(<RadioControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: true
          }
        }
      },
      submitHandler : submitHandler
    });
    getAllByText('A radio control');
    const ele = getAllByRole('radio');
    expect(ele[0].value).toEqual('true');
    expect(ele[0].checked).toEqual(true);
    expect(ele[1].value).toEqual('false');
    expect(ele[1].checked).toEqual(false);
    userEvent.click(ele[1]);
    expect(ele[1].checked).toEqual(true);
    expect(ele[0].checked).toEqual(false);

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: false
          }
        }
      }, expect.anything())
    });
  });
  it('should allow change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A radio control',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  getAllByText, getByText, getAllByRole } = formRender(<RadioControl control={control} entity="child" count={0}/>, {
      formRecord : {
        global: {
        },
        child: {
          instances: [{
            attr1: {
              value: 'val1'
            }
          }]
        }
      },
      submitHandler : submitHandler
    });
    getAllByText('A radio control');
    const ele = getAllByRole('radio');
    expect(ele[0].value).toEqual('val1');
    expect(ele[0].checked).toEqual(true);
    expect(ele[1].value).toEqual('val2');
    expect(ele[1].checked).toEqual(false);
    userEvent.click(ele[1]);
    expect(ele[1].checked).toEqual(true);
    expect(ele[0].checked).toEqual(false);

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
        },
        child: {
          instances: [{
            attr1: {
              value: 'val2'
            }
          }]
        }
      }, expect.anything())
    });
  });

  it('should handle i18n', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A radio control',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  getAllByText, getAllByRole } = formRender(<RadioControl control={control}/>, {
      locale: 'fr',
      messages: {
        fr: {
          control: {
            'A radio control': 'Le radio control'
          },
          options: {
            'Value 1': 'Le Value 1',
            'Value 2': 'Le Value 2'
          }
        }
      }
    });
    getAllByText('Le radio control');
    getAllByText('Le Value 1');
    getAllByText('Le Value 2');
    const ele = getAllByRole('radio');
    expect(ele[0].value).toEqual('val1');
    expect(ele[0].checked).toEqual(false);

    expect(ele[1].value).toEqual('val2');
    expect(ele[1].checked).toEqual(false);
  });
  it('should hide if state is hidden', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A radio control',
      state: 'hidden',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  getAllByText, getByText, getAllByRole } = formRender(<RadioControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: 'val1'
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getAllByText('A radio control')).toThrow();
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: 'val1'
          }
        }
      }, expect.anything())
    });
  });
  it('should hide if state is hidden and default will not change the value', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A radio control',
      state: 'hidden',
      default: 'val2',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  getAllByText, getByText, getAllByRole } = formRender(<RadioControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: 'val1'
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getAllByText('A radio control')).toThrow();
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: 'val1'
          }
        }
      }, expect.anything())
    });
  });
  it('should show errors', () => {
     const control = {
      attributeId: 'attr1',
      label: 'A radio control',
      errors: ['Required']
    };
    const { debug,  getByText } = formRender(<RadioControl control={control}/>);
    getByText('Required');
  });
  it('should show multiple errors', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A radio control',
      errors: ['Required', 'Missing']
    };
    const { debug,  getByText } = formRender(<RadioControl control={control}/>);
    getByText('Required');
    getByText('Missing');
  });
});