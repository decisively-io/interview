import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import BooleanControl from './BooleanControl';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

describe('BooleanControl', () => { 
  it('should render default unchecked', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
    };
    const { debug,  getByText, getByLabelText } = formRender(<BooleanControl control={control}/>);
    getByText('A boolean control');
    const checkbox = getByLabelText('A boolean control');
    expect(checkbox.checked).toEqual(false);
  });
  it('should render default checked if default provided', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
      default: true
    };
    const { debug, getByLabelText } = formRender(<BooleanControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: null
          }
        }
      }
    });
    const checkbox = getByLabelText('A boolean control');
    expect(checkbox.checked).toEqual(true);
  });
  it('should render properly with checked', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
    };
    const { debug,  getByText, getByLabelText } = formRender(<BooleanControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: true
          }
        }
      }
    });
    const checkbox = getByLabelText('A boolean control');
    expect(checkbox.checked).toEqual(true);
  });
  it('should render properly with checked in sub relationship', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
    };
    const { debug,  getByText, getByLabelText } = formRender(<BooleanControl control={control} entity={'children'} count={0}/>, {
      formRecord : {
        children: {
          instances: [{
            attr1: {
              value: true
            }
          }]
        }
      }
    });
    const checkbox = getByLabelText('A boolean control');
    expect(checkbox.checked).toEqual(true);
  });
  it('should render properly with no check', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
    };
    const { debug,  getByText, getByLabelText } = formRender(<BooleanControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: false
          }
        }
      }
    });
    getByText('A boolean control');
    const checkbox = getByLabelText('A boolean control');
    expect(checkbox.checked).toEqual(false);
  });
  it('should handle i18n', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
    };
    const { debug,  getByText } = formRender(<BooleanControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: false
          }
        }
      },
      locale: 'fr',
      messages: {
        fr: {
          control: {
            'A boolean control': 'Le bool control'
          }
        }
      }
    });
    getByText('Le bool control');
  });
  it('should hide if state is hidden', () => {
     const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
      state: 'hidden'
    };
    const { debug,  getByText } = formRender(<BooleanControl control={control}/>);
    expect(() => getByText('A boolean control')).toThrow();
  });
  it('should hide if visibility rule set', () => {
     const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
      rules: {
        hide: {
          entityId: 'global',
          attributeId: 'other_attr',
          op: 'equals',
          value: 'some value'
        }
      }
    };
    const { debug,  getByText } = formRender(<BooleanControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: false
          },
          other_attr: {
            value: 'some value'
          }
        }
      },
    });
    expect(() => getByText('A boolean control')).toThrow();
  });
  it('should not hide if visibility rule not set properly', () => {
     const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
      rules: {
        hide: {
          entityId: 'global',
          attributeId: 'other_attr',
          op: 'equals',
          value: 'some other value'
        }
      }
    };
    const { debug,  getByText } = formRender(<BooleanControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: false
          },
          other_attr: {
            value: 'some value'
          }
        }
      },
    });
    getByText('A boolean control');
  });
  it('should  hide if visibility rule set with unless', () => {
     const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
      rules: {
        hide: {
          entityId: 'global',
          attributeId: 'other_attr',
          op: 'equals',
          type: 'unless',
          value: 'some other value'
        }
      }
    };
    const { debug,  getByText } = formRender(<BooleanControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: false
          },
          other_attr: {
            value: 'some value'
          }
        }
      },
    });
    expect(() => getByText('A boolean control')).toThrow();
  });
  it('should not hide if visibility rule set with unless incorrect', () => {
     const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
      rules: {
        hide: {
          entityId: 'global',
          attributeId: 'other_attr',
          op: 'equals',
          type: 'unless',
          value: 'some value'
        }
      }
    };
    const { debug,  getByText } = formRender(<BooleanControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: false
          },
          other_attr: {
            value: 'some value'
          }
        }
      },
    });
    getByText('A boolean control');
  });
  it('should show errors', () => {
     const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
      errors: ['Required']
    };
    const { debug,  getByText } = formRender(<BooleanControl control={control}/>);
    getByText('Required');
  });
  it('should show multiple errors', () => {
    const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
      errors: ['Required', 'Missing']
    };
    const { debug,  getByText } = formRender(<BooleanControl control={control}/>);
    getByText('Required');
    getByText('Missing');
  });

  // Add change test
  it('should change values', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<BooleanControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: false
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A boolean control'));
    const checkbox = getByLabelText('A boolean control');
    expect(checkbox.checked).toEqual(true);
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      // How do I check formik?
      //expect(submitHandler).toHaveBeenCalledWith({});
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        global: {
          attr1: {
            value: true
          }
        }
      }, expect.anything())
    });
  })
  it('should change values to false', async () => {
    const submitHandler = jest.fn();
    const control = {
      attributeId: 'attr1',
      label: 'A boolean control',
    };
    const { debug,  getByLabelText, getByText } = formRender(<BooleanControl control={control}/>, {
      formRecord : {
        global: {
          attr1: {
            value: true
          }
        }
      },
      submitHandler : submitHandler
    });   
    userEvent.click(getByLabelText('A boolean control'));
    const checkbox = getByLabelText('A boolean control');
    expect(checkbox.checked).toEqual(false);
    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      // How do I check formik?
      //expect(submitHandler).toHaveBeenCalledWith({});
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
});