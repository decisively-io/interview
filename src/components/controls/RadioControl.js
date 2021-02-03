import React, { useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
  Radio
} from '@material-ui/core';
import { useFormikContext } from "formik";
import get from 'lodash/get';
import { changeFieldValue, checkHideRule } from './index';
import { useTranslate } from '../../i18n';

const RadioControl = ({control, entity, count}) => {
  const translate = useTranslate();
  const { values, setFieldValue } = useFormikContext();

  const onChange = (event) => {
    let value = event.target.value;
    if (control.attributeType === 'boolean') value = value === 'true';
    changeFieldValue(setFieldValue, control.attributeId, value, entity, count);
  }
  useEffect(() => {
    if (checkHideRule(control, values)) return; // Hidden fields can't have their value changed. Keep it the same as the server (until we are visible)
    if (value === null && typeof control.default !== 'undefined' && control.default !== null) changeFieldValue(setFieldValue, control.attributeId, control.default, entity, count);
  }, [values]);

  let value = entity ? get(values, `${entity}.instances[${count}].${control.attributeId}.value`) : get(values, `global.${control.attributeId}.value`);

  //if (value === true) value = 'true';
  //else if (value === false) value = 'false';
  if (checkHideRule(control, values)) return null;
  let showValue = (typeof value !== 'undefined' && value !== null) ? value : ((typeof control.default !== 'undefined' && control.default !== null) ? control.default : '');
 
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{translate(`control.${control.label}`)}</FormLabel>
      <RadioGroup 
        id={entity ? `${entity}_${count}_${control.attributeId}` : control.attributeId }
        row={control.orientation === 'horizontal' ? true : false} 
        required={control.required} 
        name={control.id} 
        value={showValue} 
        onChange={onChange}>
        {control.options && control.options.map((option, index) => (
          <FormControlLabel key={index} value={option.value} control={<Radio required={control.required} />} label={translate(`options.${option.label}`)}/>
        ))}
      </RadioGroup>
       { control.errors && control.errors.map((error, index) => (
        <FormHelperText key={index}>{error}</FormHelperText>
      ))}
    </FormControl>
  )
}

export default RadioControl;