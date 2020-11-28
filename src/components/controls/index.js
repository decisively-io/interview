import React from 'react';
import DateControl from './DateControl';
import DateTimeControl from './DateTimeControl';
import TextControl from './TextControl';
import SelectControl from './SelectControl';
import CurrencyControl  from './CurrencyControl';
import BooleanControl from './BooleanControl';
import UnknownControl from './UnknownControl';
import TimeControl from './TimeControl';
import Container from './Container';
import Label from './Label';
import RadioControl from './RadioControl';
import RelationshipControl from './RelationshipControl';
import ImageControl from './ImageControl';
import SignatureControl from './SignatureControl';
import get from 'lodash/get';
import { useFormikContext } from "formik";

import {
  Grid,
  Typography
} from '@material-ui/core';

const getControls = (controls, entity, count) => {
  return controls.map((control, index) => renderControl(control, index, entity, count));
}

const renderControl = (control, index, entity, count) => {
  //if (control['control-state'] === 'hidden') return null;
  let render;
  switch (control.type) {
    case 'text':
      if (control.options || control.listOptionsFilter) render = <SelectControl control={control} key={index} />
      else render = <TextControl control={control} key={index}  entity={entity} count={count}/>;
      break;
    case 'date':
      render = <DateControl control={control} key={index}  entity={entity} count={count}/>;
      break;
    case 'datetime':
      render = <DateTimeControl control={control} key={index}  entity={entity} count={count}/>;
      break;
    case 'time':
      render = <TimeControl control={control} key={index}  entity={entity} count={count}/>
      break;
    case 'label':
      render = <Label control={control} />;
      break;
    case 'select':
      render = <SelectControl control={control} key={index} entity={entity} count={count}/>;
      break;
    case 'boolean':
      render = <BooleanControl control={control} key={index}  entity={entity} count={count}/>;
      break;
    case 'currency':
      render = <CurrencyControl control={control} key={index}  entity={entity} count={count}/>;
      break;
    case 'container':
      if (entity) {
        // It takes care of rendering in the repeat control
        return control.controls.map((sub_control, sub_index) => renderControl(sub_control, sub_index, entity, count));
      } else {
        render = <Container container={control} entity={entity} count={count} />;
      }
      break;
    case 'radio':
      render = <RadioControl control={control} key={index} entity={entity} count={count}/>;
      break;
    case 'relationship':
      render = <RelationshipControl control={control} key={index} />;
      break;
    case 'form-control':
      console.warn('Unsupported control: form-control');
      break;
    case 'image':
      render = <ImageControl control={control} />;
      break;
    case 'explanation':
      break; // Don't show
    case 'signature': 
      render = <SignatureControl control={control} />;
      break;
    default:
      return <UnknownControl key={index} control={control}/>
  }
  return render;
}

const checkHideRule = (control, values) => {
  let defaultState = control.state === 'hidden' ? true : false;
  if (control.rules && control.rules.hide) {
    // Has a hide rule
    const curField = get(values, `${control.rules.hide.entityId}.${control.rules.hide.attributeId}`)
    if (!curField) return false; // Nothing to compare against
    switch (control.rules.hide.op) {
      case 'equals':
        if (control.rules.hide.type === 'unless' && control.rules.hide.value !== curField.value) return true;
        else if (control.rules.hide.type !== 'unless' && control.rules.hide.value === curField.value) return true;
        else return false; // It may actually default to showing it for some reason 
        break;
      default: 
        console.log('Unknown expression op', control.rules.hide.op);
        break;
    }
  }
  return defaultState;
}

const willRender = (control, values) => {
  if (!values || checkHideRule(control, values)) {
    if (control.type === 'relationship') {
      // Need to remove the values otherwise backend complains
      values[control.relationshipId].instances = [];
    }
    return false;
  }
  else return true;
}
const changeFieldValue = (setFieldValue, field, value, entity, count) => {
  if (entity) {
    setFieldValue(`${entity}.instances[${count}].${field}.value`, value);
  } else {
    setFieldValue(`global.${field}.value`, value);
  }
}
export { renderControl, getControls, changeFieldValue, checkHideRule, willRender }

export { Label, Container, SignatureControl, DateControl, DateTimeControl, BooleanControl, TextControl, CurrencyControl, SelectControl, UnknownControl, TimeControl, RadioControl, RelationshipControl}
