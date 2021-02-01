import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import Label from './Label';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

describe('LabelControl', () => { 
  it('should render base', () => {
    const control = {
      label: 'A label',
    };
    const { debug,  getByText } = formRender(<Label control={control}/>);
    const container = getByText('A label');
    expect(container).toHaveClass('MuiTypography-body1')
  });
  it('should render heading 1', () => {
    const control = {
      label: 'A label',
      style: 'Heading 1'
    };
    const { debug,  getByText } = formRender(<Label control={control}/>);
    const container = getByText('A label');
    expect(container).toHaveClass('MuiTypography-h2')
  });
  it('should render heading 2', () => {
    const control = {
      label: 'A label',
      style: 'Heading 2'
    };
    const { debug,  getByText } = formRender(<Label control={control}/>);
    const container = getByText('A label');
    expect(container).toHaveClass('MuiTypography-h3')
  });
  it('should render heading 3', () => {
    const control = {
      label: 'A label',
      style: 'Heading 3'
    };
    const { debug,  getByText } = formRender(<Label control={control}/>);
    const container = getByText('A label');
    expect(container).toHaveClass('MuiTypography-h4')
  });
  it('should render heading 4', () => {
    const control = {
      label: 'A label',
      style: 'Heading 4'
    };
    const { debug,  getByText } = formRender(<Label control={control}/>);
    const container = getByText('A label');
    expect(container).toHaveClass('MuiTypography-h5')
  });
  it('should render comment', () => {
    const control = {
      label: 'A label',
      style: 'Comment'
    };
    const { debug,  getByText } = formRender(<Label control={control}/>);
    const container = getByText('A label');
    expect(container).toHaveClass('MuiTypography-body2')
  });
  it('should render Normal', () => {
    const control = {
      label: 'A label',
      style: 'Normal'
    };
    const { debug,  getByText } = formRender(<Label control={control}/>);
    const container = getByText('A label');
    expect(container).toHaveClass('MuiTypography-body1')
  });
  it('should render default style with invalid input', () => {
    const control = {
      label: 'A label',
      style: 'Fake'
    };
    const { debug,  getByText } = formRender(<Label control={control}/>);
    const container = getByText('A label');
    expect(container).toHaveClass('MuiTypography-body1')
  });
  it('should hide if state is hidden', async () => {
    const submitHandler = jest.fn();
    const control = {
      label: 'A label control',
      state: 'hidden'
    };
    const { debug,  getByText } = formRender(<Label control={control}/>);
    expect(() => getByText('A label control')).toThrow();
  });
  it('should not change submission', async () => {
    const submitHandler = jest.fn();
    const control = {
      label: 'A label',
    };
    const { debug,  getByText } = formRender(<Label control={control}/>,{
      formRecord : {
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
  it('should handle i18n', () => {
    const control = {
      label: 'A label'
    };
    const { debug,  getAllByText } = formRender(<Label control={control}/>, {
      locale: 'fr',
      messages: {
        fr: {
          control: {
            'A label': 'Le label'
          }
        }
      }
    });
    getAllByText('Le label');
  });
});