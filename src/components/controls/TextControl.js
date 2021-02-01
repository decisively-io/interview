import React, { useEffect } from 'react';
import {
  TextField,
  FormControl,
  FormHelperText
} from '@material-ui/core';
import { useFormikContext } from "formik";
import get from 'lodash/get';
import set from 'lodash/set';
import { changeFieldValue, checkHideRule } from './index';
import { useTranslate } from '../../i18n';

const TextControl = ({control, entity, count}) => {
  const translate = useTranslate();
  const { values, setFieldValue } = useFormikContext();
  
  const onChange = (event) => {
    const value = event.target.value;
    changeFieldValue(setFieldValue, control.attributeId, value, entity, count);
  }
  let value = entity ? get(values, `${entity}.instances[${count}].${control.attributeId}.value`) : get(values, `global.${control.attributeId}.value`);
  useEffect(() => {
    if (checkHideRule(control, values)) return; // Hidden fields can't have their value changed. Keep it the same as the server (until we are visible)
    if (value === null && typeof control.default !== 'undefined')  changeFieldValue(setFieldValue, control.attributeId, control.default, entity, count);
  }, [values]);
  //if (!values) return null;

  // Check if there is a abbr in the caption
  const regex = /title="(.*)"/m;
  let m;
  let helperText = "";
  let label = control.label;
  if ((m = regex.exec(control.label)) !== null) {
    helperText = m[1];
    const replace = /\(.*\)/m;
    const subst = ``;
    label = label.replace(replace, subst);
  }

  if (checkHideRule(control, values)) return null;
  return (
    <FormControl fullWidth>
      <TextField 
        id={control.attributeId}
        variant="outlined" 
        required={control.required} 
        name={control.id} 
        label={translate(`control.${label}`)} 
        value={value || control.default || ''} 
        onChange={onChange} 
        error={control.errors && control.errors.length > 0} 
        helperText={helperText}/>
        { control.errors && control.errors.map((error, index) => (
          <FormHelperText key={index}>{error}</FormHelperText>
        ))}
    </FormControl>
  )
}

export default TextControl;