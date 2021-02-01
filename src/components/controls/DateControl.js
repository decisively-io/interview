import React, {useEffect} from 'react';
import {
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
  FormControl, FormHelperText
} from '@material-ui/core';
import { useFormikContext } from "formik";
import get from 'lodash/get';
import set from 'lodash/set';
import moment from 'moment';
import { changeFieldValue, checkHideRule } from './index';
import { useTranslate } from '../../i18n';

const DateControl = ({control, entity, count }) => {
  const translate = useTranslate();

  const { values, errors, setFieldValue, setFieldError } = useFormikContext();
  let value = entity ? get(values, `${entity}.instances[${count}].${control.attributeId}.value`) : get(values, `global.${control.attributeId}.value`);
  useEffect(() => {
    if (checkHideRule(control, values)) return; // Hidden fields can't have their value changed. Keep it the same as the server (until we are visible)
    if (value === null && typeof control.default !== 'undefined') changeFieldValue(setFieldValue, control.attributeId, control.default, entity, count);
  }, [values]);

  let maxDate = new Date('2100-01-01');
  let minDate = new Date('1900-01-01');
  let disablePast = control.yearStart == 0 ? true : false;
  let disableFuture = control.yearEnd == 0 ? true : false;
  if (!isNaN(control.yearEnd)) {
    const yearEnd = parseInt(control.yearEnd);
    if (yearEnd >= 0) maxDate = moment().add(yearEnd, 'y');
    else {
      minDate = moment().add(yearEnd, 'y'); // It's already negatvie so add the minus
      disablePast = false;
      if (control.yearStart == 0) disableFuture = true;
    }
  }

  const onChange = (value) => {
    if (!value || isNaN(Date.parse(value))) return; // Invalid date
    // For some reason onChange fires even if the date is invalid (atleast in testing)
    let error;
    if ((disablePast && value < new Date()) || value < minDate) error = translate('interview.minDateError');
    if ((disableFuture && value > new Date()) || value > maxDate) error = translate('interview.maxDateError');

    if (error) {
      setFieldError(control.attributeId, error);
      return; // Don't change the value
    }
    changeFieldValue(setFieldValue, control.attributeId, moment(value).format('YYYY-MM-DD'), entity, count);
  }
  
  //console.log('disable past', disablePast);
  if (checkHideRule(control, values)) return null;
  return (
    <FormControl fullWidth>
      <KeyboardDatePicker
        id={control.attributeId}
        required={control.required} 
        disableToolbar
        inputVariant="outlined"
        variant="inline"
        format="dd/MM/yyyy"
        name={control.id}
        label={translate(`control.${control.label}`)}
        value={value || control.default || null}
        onChange={onChange}
        //autoOk={true}
        disablePast={disablePast}
        disableFuture={disableFuture}
        maxDate={maxDate}
        minDate={minDate}
        error={(control.errors && control.errors.length > 0) || errors.hasOwnProperty(control.attributeId)}
      />
      { control.errors && control.errors.map((error, index) => (
        <FormHelperText key={index}>{error}</FormHelperText>
      ))}
      { errors[control.attributeId] && (
        <FormHelperText>{errors[control.attributeId]}</FormHelperText>
      )}

    </FormControl>
  )
}
export default DateControl;