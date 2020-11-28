import React, { useEffect } from 'react';
import {
  FormControlLabel,
  FormHelperText,
  FormControl,
  Checkbox
} from '@material-ui/core';
import { useFormikContext } from "formik";
import get from 'lodash/get';
import { changeFieldValue, checkHideRule } from './index';
import { useTranslate } from '../../i18n';

const BooleanControl = ({control, entity, count}) => {
  const translate = useTranslate();

  const { values, setFieldValue } = useFormikContext();

  const onChange = (event) => {
    const value = event.target.checked;
    changeFieldValue(setFieldValue, control.attributeId, value, entity, count);
  }
  let value;
  useEffect(() => {
    if (checkHideRule(control, values)) return; // Hidden fields can't have their value changed. Keep it the same as the server (until we are visible)
    if (value === null && (typeof control.default !== 'undefined' && control.default !== null)) changeFieldValue(setFieldValue, control.attributeId, control.default, entity, count);
    else if (value === null) changeFieldValue(setFieldValue, control.attributeId, false, entity, count); // Boolean controls are by default 'false' (unless otherwise specified) as not clicking it is leaving it as false
  }, [values]);
  value = entity ? get(values, `${entity}.instances[${count}].${control.attributeId}.value`) : get(values, `global.${control.attributeId}.value`);

  if (checkHideRule(control, values)) return null;
  return (
    <FormControl fullWidth>
      <FormControlLabel
        control={
          <Checkbox
            checked={value ? true : false}
            onChange={onChange}
            //required={control.required}  // Can't do required as 'false' isn't considered an answer
            color="primary"/>
        }
        label={translate(`control.${control.label}`)}
        />
        { control.errors && control.errors.map((error, index) => (
          <FormHelperText key={index}>{error}</FormHelperText>
        ))}
    </FormControl>
  )
}
export default BooleanControl;