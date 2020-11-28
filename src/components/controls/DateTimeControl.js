import React, { useEffect} from 'react';
import {
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import {
  FormControl, FormHelperText
} from '@material-ui/core';
import { useFormikContext } from "formik";
import get from 'lodash/get';
import { changeFieldValue, checkHideRule } from './index';
import { useTranslate } from '../../i18n';
import moment from 'moment';

const DateTimeControl = ({control, entity, count, editMode}) => {
  const { values, setFieldValue } = useFormikContext();
  const translate = useTranslate();

  const onChange = (value) => {
    if (!value || isNaN(Date.parse(value))) return; // Invalid date
    changeFieldValue(setFieldValue, control.attributeId, moment(value).utc().format('YYYY-MM-DDTHH:mm:ss'), entity, count);
  }
  let value = entity ? get(values, `${entity}.instances[${count}].${control.attributeId}.value`) : get(values, `global.${control.attributeId}.value`);
  useEffect(() => {
    if (checkHideRule(control, values)) return; // Hidden fields can't have their value changed. Keep it the same as the server (until we are visible)
    if (value === null && typeof control.default !== 'undefined') changeFieldValue(setFieldValue, control.attributeId, control.default, entity, count);
  }, [values]);

  if (checkHideRule(control, values)) return null;
  return (
    <FormControl fullWidth>
      <KeyboardDateTimePicker
        required={control.required} 
        disableToolbar
        inputVariant="outlined"
        variant="inline"
        name={control.id}
        label={translate(`control.${control.label}`)}
        value={value || control.default || null}
        onChange={onChange}
        autoOk={true}
        fullWidth
      />
      { control.errors && control.errors.map((error, index) => (
        <FormHelperText key={index}>{error['$value']}</FormHelperText>
      ))}

    </FormControl>
  )
}

export default DateTimeControl;