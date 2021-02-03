import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor, within, prettyDOM } from '../../test-utils';
import RelationshipControl from './RelationshipControl';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

describe('RelationshipControl', () => { 
  it('should not render without template', () => {
    const control = {
      relationshipId: 'people',
      label: 'A relationship control'
    };
    const { debug, getByRole, getByText, getAllByRole, getByLabelText, getAllByText} = formRender(<RelationshipControl control={control}/>);
    expect(() => getAllByText('A Relationship Control')).toThrow();
  });

  it('should render base and add instance', async () => {
    const submitHandler = jest.fn();
    const control = {
      relationshipId: 'people',
      label: 'A relationship control',
      template: {
        values: {
          first_name: {
            value: null
          },
          gender: {
            value: null
          }
        },
        controls: [{
          type: 'text',
          label: 'First Name',
          attributeId: 'first_name'
        }, {
          type: 'radio',
          attributeId: 'gender',
          label: 'Gender',
          options: [{
            label: 'Male',
            value: 'male'
          },{
            label: 'Female',
            value: 'female'
          }]
        }]
      }
    };
    const { debug, getByRole, getByText, getAllByRole, getByLabelText, getAllByText} = formRender(<RelationshipControl control={control}/>, {
      formRecord: {
        people: {
          instances: []
        }
      },
      submitHandler : submitHandler
    });
    getAllByText('A Relationship Control');
    expect(() => getAllByText('First Name')).toThrow();
    expect(() => getAllByText('Male')).toThrow();
    userEvent.click(getByRole('button', {name: 'add'}));
    getAllByText('First Name');
    getAllByText('Gender');
    getAllByText('Male');

    const ele = getByLabelText('First Name');
    expect(ele.value).toEqual('');
    const radioEle = getAllByRole('radio');
    expect(radioEle[0].value).toEqual('male');
    expect(radioEle[0].checked).toEqual(false);
    expect(radioEle[1].checked).toEqual(false);

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        people: {
          instances: [{
            first_name: {
              value: null
            },
            gender: {
              value: null
            }
          }]
        }
      }, expect.anything())
    });
  });

  it('should render with existing and add instance', async () => {
    const submitHandler = jest.fn();
    const control = {
      relationshipId: 'people',
      label: 'A relationship control',
      template: {
        values: {
          first_name: {
            value: null
          },
          gender: {
            value: null
          }
        },
        controls: [{
          type: 'text',
          label: 'First Name',
          attributeId: 'first_name'
        }, {
          type: 'radio',
          attributeId: 'gender',
          label: 'Gender',
          options: [{
            label: 'Male',
            value: 'male'
          },{
            label: 'Female',
            value: 'female'
          }]
        }]
      }
    };
    const { debug, container, getByRole, getByText, getAllByLabelText, getAllByRole, getByLabelText, getAllByText} = formRender(<RelationshipControl control={control}/>, {
      formRecord: {
        people: {
          instances: [{
            first_name: {
              value: 'Test'
            },
            gender: {
              value: 'male'
            }
          }]
        }
      },
      submitHandler : submitHandler
    });
    getAllByText('A Relationship Control');
    getAllByText('First Name');
    const fName = getByLabelText('First Name');
    expect(fName.value).toEqual('Test');

    getAllByText('Male');
    const radioEle = getAllByRole('radio');
    expect(radioEle[0].value).toEqual('male');
    expect(radioEle[0].checked).toEqual(true);

    userEvent.click(getByRole('button', {name: 'add'}));
    const ele = getAllByLabelText('First Name');
    expect(ele[1].value).toEqual('');
    const newRadioEle = getAllByRole('radio');
    expect(newRadioEle[2].value).toEqual('male');
    expect(newRadioEle[2].checked).toEqual(false);
    expect(newRadioEle[3].checked).toEqual(false);

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        people: {
          instances: [{
            first_name: {
              value: 'Test'
            },
            gender: {
              value: 'male'
            }
          },{
            first_name: {
              value: null
            },
            gender: {
              value: null
            }
          }]
        }
      }, expect.anything())
    });
  });

  it('should render with existing and remove instance', async () => {
    const submitHandler = jest.fn();
    const control = {
      relationshipId: 'people',
      label: 'A relationship control',
      template: {
        values: {
          first_name: {
            value: null
          },
          gender: {
            value: null
          }
        },
        controls: [{
          type: 'text',
          label: 'First Name',
          attributeId: 'first_name'
        }, {
          type: 'radio',
          attributeId: 'gender',
          label: 'Gender',
          options: [{
            label: 'Male',
            value: 'male'
          },{
            label: 'Female',
            value: 'female'
          }]
        }]
      }
    };
    const { debug, container, getByRole, getByText, getAllByLabelText, getAllByRole, getByLabelText, getAllByText} = formRender(<RelationshipControl control={control}/>, {
      formRecord: {
        people: {
          instances: [{
            first_name: {
              value: 'Test'
            },
            gender: {
              value: 'male'
            }
          }]
        }
      },
      submitHandler : submitHandler
    });
    getAllByText('A Relationship Control');
    getAllByText('First Name');
    const fName = getByLabelText('First Name');
    expect(fName.value).toEqual('Test');

    getAllByText('Male');
    const radioEle = getAllByRole('radio');
    expect(radioEle[0].value).toEqual('male');
    expect(radioEle[0].checked).toEqual(true);

    userEvent.click(getByRole('button', {name: 'remove'}));
    expect(() => getAllByText('First Name')).toThrow();
    expect(() => getAllByText('Male')).toThrow();

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        people: {
          instances: []
        }
      }, expect.anything())
    });
  });

  it('should render with existing and add and remove instance', async () => {
    const submitHandler = jest.fn();
    const control = {
      relationshipId: 'people',
      label: 'A relationship control',
      template: {
        values: {
          first_name: {
            value: null
          },
          gender: {
            value: null
          }
        },
        controls: [{
          type: 'text',
          label: 'First Name',
          attributeId: 'first_name'
        }, {
          type: 'radio',
          attributeId: 'gender',
          label: 'Gender',
          options: [{
            label: 'Male',
            value: 'male'
          },{
            label: 'Female',
            value: 'female'
          }]
        }]
      }
    };
    const { debug, container, getByRole, getByText, getAllByLabelText, getAllByRole, getByLabelText, getAllByText} = formRender(<RelationshipControl control={control}/>, {
      formRecord: {
        people: {
          instances: [{
            first_name: {
              value: 'Test'
            },
            gender: {
              value: 'male'
            }
          }]
        }
      },
      submitHandler : submitHandler
    });
    getAllByText('A Relationship Control');
    getAllByText('First Name');
    const fName = getByLabelText('First Name');
    expect(fName.value).toEqual('Test');

    getAllByText('Male');
    const radioEle = getAllByRole('radio');
    expect(radioEle[0].value).toEqual('male');
    expect(radioEle[0].checked).toEqual(true);

    userEvent.click(getByRole('button', {name: 'add'}));
    const ele = getAllByLabelText('First Name');
    expect(ele[1].value).toEqual('');
    const newRadioEle = getAllByRole('radio');
    expect(newRadioEle[2].value).toEqual('male');
    expect(newRadioEle[2].checked).toEqual(false);
    expect(newRadioEle[3].checked).toEqual(false);

    userEvent.click(getAllByRole('button', {name: 'remove'})[1]);

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        people: {
          instances: [{
            first_name: {
              value: 'Test'
            },
            gender: {
              value: 'male'
            }
          }]
        }
      }, expect.anything())
    });
  });
  it('should render with existing and add instance with values', async () => {
    const submitHandler = jest.fn();
    const control = {
      relationshipId: 'people',
      label: 'A relationship control',
      template: {
        values: {
          first_name: {
            value: null
          },
          gender: {
            value: null
          }
        },
        controls: [{
          type: 'text',
          label: 'First Name',
          attributeId: 'first_name'
        }, {
          type: 'radio',
          attributeId: 'gender',
          label: 'Gender',
          options: [{
            label: 'Male',
            value: 'male'
          },{
            label: 'Female',
            value: 'female'
          }]
        }]
      }
    };
    const { debug, container, getByRole, getByText, getAllByLabelText, getAllByRole, getByLabelText, getAllByText} = formRender(<RelationshipControl control={control}/>, {
      formRecord: {
        people: {
          instances: [{
            first_name: {
              value: 'Test'
            },
            gender: {
              value: 'male'
            }
          }]
        }
      },
      submitHandler : submitHandler
    });
    getAllByText('A Relationship Control');
    getAllByText('First Name');
    const fName = getByLabelText('First Name');
    expect(fName.value).toEqual('Test');

    getAllByText('Male');
    const radioEle = getAllByRole('radio');
    expect(radioEle[0].value).toEqual('male');
    expect(radioEle[0].checked).toEqual(true);

    userEvent.click(getByRole('button', {name: 'add'}));
    const ele = getAllByLabelText('First Name');
    const newRadioEle = getAllByRole('radio');

    userEvent.type(ele[1], 'New Test');
    userEvent.click(newRadioEle[3]);

    expect(ele[1].value).toEqual('New Test');
    expect(newRadioEle[2].checked).toEqual(false);
    expect(newRadioEle[3].checked).toEqual(true);

    userEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith({
        people: {
          instances: [{
            first_name: {
              value: 'Test'
            },
            gender: {
              value: 'male'
            }
          },{
            first_name: {
              value: 'New Test'
            },
            gender: {
              value: 'female'
            }
          }]
        }
      }, expect.anything())
    });
  });
  it('should support i18n', async () => {
    const submitHandler = jest.fn();
    const control = {
      relationshipId: 'people',
      label: 'A relationship control',
      template: {
        values: {
          first_name: {
            value: null
          },
          gender: {
            value: null
          }
        },
        controls: [{
          type: 'text',
          label: 'First Name',
          attributeId: 'first_name'
        }, {
          type: 'radio',
          attributeId: 'gender',
          label: 'Gender',
          options: [{
            label: 'Male',
            value: 'male'
          },{
            label: 'Female',
            value: 'female'
          }]
        }]
      }
    };
    const { debug, getByRole, getByText, getAllByRole, getByLabelText, getAllByText} = formRender(<RelationshipControl control={control}/>, {
      formRecord: {
        people: {
          instances: []
        }
      },
      locale: 'fr',
      messages: {
        fr: {
          control: {
            'A relationship control': 'Le relationship control',
            'First Name': 'Le First Name',
            'Gender': 'Le Gender'
          },
          options: {
            'Male': 'Le Male ',
            'Female': 'Le Female'
          }
        }
      },
      submitHandler : submitHandler
    });
    getAllByText('Le Relationship Control');
    expect(() => getAllByText('Le First Name')).toThrow();
    expect(() => getAllByText('Le Male')).toThrow();
    userEvent.click(getByRole('button', {name: 'add'}));
    getAllByText('Le First Name');
    getAllByText('Le Gender');
    getAllByText('Le Male');
  });
});