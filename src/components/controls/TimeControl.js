import React, { useEffect } from 'react';
import {
  KeyboardTimePicker as KeyboardTimePicker,
} from '@material-ui/pickers';
import {
  FormControl, FormHelperText
} from '@material-ui/core';
import { useFormikContext } from "formik";
import styled from 'styled-components';
import { changeFieldValue, checkHideRule } from './index';
import get from 'lodash/get';
import moment from 'moment';
import { useTranslate } from '../../i18n';

const TimeControl = ({control, entity, count}) => {
  const { values, setFieldValue } = useFormikContext();
  const translate = useTranslate();

  const onChange = (value) => {
    if (!value || isNaN(Date.parse(value))) return; // Invalid date
    changeFieldValue(setFieldValue, control.attributeId, moment(value).format('YYYY-MM-DDTHH:mm:ss'), entity, count);
  }

  let value = entity ? get(values, `${entity}.instances[${count}].${control.attributeId}.value`) : get(values, `global.${control.attributeId}.value`);
  useEffect(() => {
    if (checkHideRule(control, values)) return; // Hidden fields can't have their value changed. Keep it the same as the server (until we are visible)
    if (value === null && typeof control.default !== 'undefined') changeFieldValue(setFieldValue, control.attributeId, control.default, entity, count);
  }, [values]); 

  if (checkHideRule(control, values)) return null;
  let showValue = (typeof value !== 'undefined' && value !== null) ? moment(value, 'YYYY-MM-DDTHH:mm:ss').toDate() : ((typeof control.default !== 'undefined' && control.default !== null) ? moment(control.default, 'YYYY-MM-DDTHH:mm:ss').toDate() : '');

  return (
    <FormControl fullWidth>
      <KeyboardTimePicker
        id={entity ? `${entity}_${count}_${control.attributeId}` : control.attributeId }
        required={control.required} 
        placeholder="08:00 AM"
        inputVariant="outlined"
        mask="__:__ _M"
        variant="inline"
        name={control.id}
        label={translate(`control.${control.label}`)}
        value={showValue}
        onChange={onChange}
        //autoOk={true}
        fullWidth
      />
      { control.errors && control.errors.map((error, index) => (
        <FormHelperText key={index}>{error}</FormHelperText>
      ))}

    </FormControl>
  )
}

export default TimeControl;