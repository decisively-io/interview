import React, { useRef, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@material-ui/core';
import { useFormikContext } from "formik";
import get from 'lodash/get';
import set from 'lodash/set';
import { changeFieldValue, checkHideRule } from './index';
import { useTranslate } from '../../i18n';

const SelectControl = ({control, entity, count}) => {
  const labelRef = useRef()
  const { values, setFieldValue } = useFormikContext();
  const translate = useTranslate();

  const onChange = (event) => {
    const value = event.target.value;
    changeFieldValue(setFieldValue, control.attributeId, value, entity, count);
  }

  useEffect(() => {
    if (checkHideRule(control, values)) return; // Hidden fields can't have their value changed. Keep it the same as the server (until we are visible)
    if (value === null && typeof control.default !== 'undefined')  changeFieldValue(setFieldValue, control.attributeId, control.default, entity, count);
  }, [values]);


  let value = entity ? get(values, `${entity}.instances[${count}].${control.attributeId}.value`) : get(values, `global.${control.attributeId}.value`);
  
  const labelWidth = labelRef.current ? labelRef.current.clientWidth : 0;

  if (checkHideRule(control, values)) return null;
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel ref={labelRef}>{translate(`control.${control.label}`)}</InputLabel>
      <Select 
        id={entity ? `${entity}_${count}_${control.attributeId}` : control.attributeId }
        required={control.required} 
        labelWidth={labelWidth} 
        name={control.id} 
        onChange={onChange} 
        value={value || control.default || ''} 
        error={control.errors && control.errors.length > 0}>
        {control.options && control.options.filter((o) => o.hasOwnProperty('value')).map((option, index) => {
          return <MenuItem key={index} value={option.value}>{translate(`options.${(option.label || option.value)}`)}</MenuItem>
        })}
      </Select>
      { control.errors && control.errors.map((error, index) => (
        <FormHelperText key={index}>{error}</FormHelperText>
      ))}
    </FormControl>
  )
}
export default SelectControl;