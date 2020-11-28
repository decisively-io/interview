import React from 'react';
import { useFormikContext } from "formik";
import {
  Grid
} from '@material-ui/core';
import { renderControl, checkHideRule, willRender } from './index';

const Container = ({container, entity, count}) => {
  const { values } = useFormikContext();

  if (checkHideRule(container, values)) return null;

  if (container.orientation === 'vertical') {
    return (
      <Grid container spacing={6}>
        {container.controls.map((sub_control, sub_index) => {
          if (!willRender(sub_control, values)) return null;
          return (
            <Grid item xs={12} key={sub_index}>
              {renderControl(sub_control, sub_index, entity, count)}
            </Grid>
          )}
        )}
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={6}>
        {container.controls.map((sub_control, sub_index) => {
          if (!willRender(sub_control, values)) return null;
          return (
            <Grid item xs key={sub_index}>
              {renderControl(sub_control, sub_index, entity, count)}
            </Grid>
          )
        })}
      </Grid>
    )
  }
}

export default Container;