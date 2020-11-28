import React, { useEffect } from 'react';
import {
  FormControl,
  TextField,
  FormHelperText
} from '@material-ui/core';
import { useFormikContext } from "formik";
import get from 'lodash/get';
import NumberFormat from 'react-number-format';
import { changeFieldValue, checkHideRule } from './index';
import { useTranslate } from '../../i18n';

const CurrencyFormat = (props) => {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      //allowNegative={
      isNumericString
      prefix="$"
    />
  );
}

const CurrencyControl = ({control, entity, count}) => {
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
  if (!values) return null;

  const allowNegative = control.minValue === "0.0" ? false : true;

  if (checkHideRule(control, values)) return null;
  return (
    <FormControl fullWidth>
      <TextField variant="outlined" required={control.required}  onChange={onChange} label={translate(`control.${control.label}`)} value={value || control.default || ''} InputProps={{
        inputComponent: CurrencyFormat,
        inputProps: { allowNegative: allowNegative}
      }} error={control.errors && control.errors.length > 0}/>
      { control.errors && control.errors.map((error, index) => (
        <FormHelperText key={index}>{error}</FormHelperText>
      ))}
    </FormControl>
  )
}
export default CurrencyControl;