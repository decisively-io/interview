import React from 'react';

import { formRender, cleanup, fireEvent, act, waitFor } from '../../test-utils';
import { renderControl, checkHideRule } from './index';
import userEvent from '@testing-library/user-event'
import moment from 'moment';

afterEach(cleanup);

describe('Index tests', () => { 
  it('should render text', () => {
    const control = {
      type: 'text',
      label: 'A text control'
    };
    const { debug,  getAllByText } = formRender(renderControl(control));
    getAllByText('A text control');
  });
  it('should render date', () => {
    const control = {
      type: 'date',
      label: 'A date control'
    };
    const { debug,  getAllByText } = formRender(renderControl(control));
    getAllByText('A date control');
  });
  it('should render datetime', () => {
    const control = {
      type: 'datetime',
      label: 'A datetime control'
    };
    const { debug,  getAllByText } = formRender(renderControl(control));
    getAllByText('A datetime control');
  });
  it('should render time', () => {
    const control = {
      type: 'time',
      label: 'A time control'
    };
    const { debug,  getAllByText } = formRender(renderControl(control));
    getAllByText('A time control');
  });
  it('should render label', () => {
    const control = {
      type: 'label',
      label: 'A label'
    };
    const { debug,  getAllByText } = formRender(renderControl(control));
    getAllByText('A label');
  });
  it('should render select', () => {
    const control = {
      type: 'select',
      label: 'A select control'
    };
    const { debug,  getAllByText } = formRender(renderControl(control));
    getAllByText('A select control');
  });
  it('should render boolean', () => {
    const control = {
      type: 'boolean',
      label: 'A boolean control'
    };
    const { debug,  getAllByText } = formRender(renderControl(control));
    getAllByText('A boolean control');
  });
  it('should render currency', () => {
    const control = {
      type: 'currency',
      label: 'A currency control'
    };
    const { debug,  getAllByText } = formRender(renderControl(control));
    getAllByText('A currency control');
  });
  it('should render radio', () => {
    const control = {
      type: 'radio',
      label: 'A radio control'
    };
    const { debug,  getAllByText } = formRender(renderControl(control));
    getAllByText('A radio control');
  });
  it('should render image', () => {
    const control = {
      type: 'image',
      image: 'sdfsf'
    };
    const { debug,  getByRole } = formRender(renderControl(control));
    getByRole('img');
  });
  it('should not render explanation', () => {
    const control = {
      type: 'explanation'
    };
    const { debug,  getAllByText } = formRender(renderControl(control));
    expect(() => getAllByText('exp')).toThrow();
  });
  it('should not render form-control', () => {
    const control = {
      type: 'form-control'
    };
    const { debug,  getAllByText } = formRender(renderControl(control));
    expect(() => getAllByText('form')).toThrow();
  });
  it('handles hiding', () => {
    expect(checkHideRule({
      state: 'hidden'
    })).toEqual(true);
    expect(checkHideRule({
      state: 'other'
    })).toEqual(false);
    expect(checkHideRule({
      state: 'other',
      rules: {
        hide: {
          entityId: 'global',
          attributeId: 'other_attr',
          op: 'equals',
          value: 'some value'
        }
      }
    }, {
      global: {
        attr1: {
          value: false
        },
        other_attr: {
          value: 'some value'
        }
      }
    })).toEqual(true);
    expect(checkHideRule({
      state: 'other',
      rules: {
        hide: {
          entityId: 'global',
          attributeId: 'other_attr',
          op: 'equals',
          value: 'some value'
        }
      }
    }, {
      global: {
        attr1: {
          value: false
        },
        other_attr: {
          value: 'other value'
        }
      }
    })).toEqual(false);
    expect(checkHideRule({
      state: 'other',
      rules: {
        hide: {
          entityId: 'global',
          attributeId: 'other_attr',
          op: 'equals',
          type: 'unless',
          value: 'some other value'
        }
      }
    }, {
      global: {
        attr1: {
          value: false
        },
        other_attr: {
          value: 'some value'
        }
      }
    })).toEqual(true);
    expect(checkHideRule({
      state: 'other',
      rules: {
        hide: {
          entityId: 'global',
          attributeId: 'other_attr',
          op: 'equals',
          type: 'unless',
          value: 'some other value'
        }
      }
    }, {
      global: {
        attr1: {
          value: false
        },
        other_attr: {
          value: 'some other value'
        }
      }
    })).toEqual(false);

    //const { debug,  getAllByText } = formRender(renderControl(control));
    
  });
});