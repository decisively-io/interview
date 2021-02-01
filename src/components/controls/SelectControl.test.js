import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor, within } from '../../test-utils';
import SelectControl from './SelectControl';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

describe('SelectControl', () => { 
  it('should render base', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A select control',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  container, getAllByText} = formRender(<SelectControl control={control}/>);
    getAllByText('A select control');

    const ele = container.querySelector('input')
    expect(ele.value).toEqual('');
  });
  it('should render default', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A select control',
      default: 'val1',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  container, getAllByText } = formRender(<SelectControl control={control}/>);
    getAllByText('A select control');
    const ele = container.querySelector('input')
    expect(ele.value).toEqual('val1');
  });
  it('should render value', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A select control',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  container, getAllByText } = formRender(<SelectControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: 'val1'
          }
        }
      }
    });
    getAllByText('A select control');
    const ele = container.querySelector('input')
    expect(ele.value).toEqual('val1');
  });
  it('should allow change', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A select control',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  container, getByRole, getByText, getAllByText, getAllByRole } = formRender(<SelectControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: 'val1'
          }
        }
      },
      submitHandler : submitHandler
    });
    getAllByText('A select control');
    userEvent.click(getAllByRole('button')[0])

    const listbox = within(getByRole('listbox'));

    userEvent.click(listbox.getByText(/Value 2/i));

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
  
  it('should allow change with relationship', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A select control',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  getAllByText, getByRole, getByText, getAllByRole } = formRender(<SelectControl control={control} entity="child" count={0}/>, {
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
    getAllByText('A select control');
    userEvent.click(getAllByRole('button')[0])

    const listbox = within(getByRole('listbox'));

    userEvent.click(listbox.getByText(/Value 2/i));

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
      label: 'A select control',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug, getByText, getAllByRole } = formRender(<SelectControl control={control}/>, {
      locale: 'fr',
      messages: {
        fr: {
          control: {
            'A select control': 'Le select control'
          },
          options: {
            'Value 1': 'Le Value 1',
            'Value 2': 'Le Value 2'
          }
        }
      }
    });
    getByText('Le select control');
    userEvent.click(getAllByRole('button')[0])
    getByText('Le Value 1');
    getByText('Le Value 2');
  });
  it('should hide if state is hidden', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A select control',
      state: 'hidden',
      options: [{
        value: 'val1',
        label: 'Value 1'
      },{
        value: 'val2',
        label: 'Value 2'
      }]
    };
    const { debug,  getAllByText, getByText, getAllByRole } = formRender(<SelectControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: 'val1'
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getAllByText('A select control')).toThrow();
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
      label: 'A select control',
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
    const { debug,  getAllByText, getByText, getAllByRole } = formRender(<SelectControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: 'val1'
          }
        }
      },
      submitHandler : submitHandler
    });
    expect(() => getAllByText('A select control')).toThrow();
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
      label: 'A select control',
      errors: ['Required']
    };
    const { debug,  getByText } = formRender(<SelectControl control={control}/>);
    getByText('Required');
  });
  it('should show multiple errors', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A select control',
      errors: ['Required', 'Missing']
    };
    const { debug,  getByText } = formRender(<SelectControl control={control}/>);
    getByText('Required');
    getByText('Missing');
  });
});