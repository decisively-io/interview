import React from 'react';
import { useFormikContext } from "formik";
import {
  Typography
} from '@material-ui/core';
import { checkHideRule } from './index';
import { useTranslate } from '../../i18n';

const headingStyles = {
  "Heading 4": "h5",
  "Heading 2": "h3",
  "Normal": "body1",
  "Comment": "body2"
}


const Label = ({control}) => {
  const { values } = useFormikContext();
  const translate = useTranslate();

  if (checkHideRule(control, values)) return null;

  return (
    <Typography variant={headingStyles[control.style] ? headingStyles[control.style] : "body1"} dangerouslySetInnerHTML={{ __html: translate(`control.${control.label}`) }}>
      </Typography>
  )
  
}

export default Label;