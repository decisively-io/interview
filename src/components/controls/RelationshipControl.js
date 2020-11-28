import React, {Fragment} from 'react';
import { renderControl, getControls, checkHideRule } from './index';
import styled from 'styled-components';

import {
  Grid,
  IconButton,
  Typography,
  Button,
  ButtonGroup
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import { useFormikContext, FieldArray } from "formik";
import startCase from 'lodash/startCase';
import get from 'lodash/get';

const Wrapper = styled.div`
  padding-top: 20px;
`;
const EntityRow = ({index, tmpl, instance, parent, arrayHelpers}) => {
  const removeHandler = () => {
    arrayHelpers.remove(index)
  }
  console.log('ENTITY ROW');
      
  const entity_controls = getControls(tmpl, parent.relationshipId, index);
  //if (entity_control)
  return (
    <Grid container spacing={6}>
      <Grid item xs={11}>
        <Grid container spacing={6}>
          { entity_controls.map((c, c_index) => (
            <Grid item xs={11} sm={6} md={4} key={c_index}>
              {c}
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={1}>

        <IconButton onClick={removeHandler} aria-label="remove">
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}

const RelationshipControl = ({control, index}) => {
  
  const { values, setFieldValue } = useFormikContext();

  if (checkHideRule(control, values)) {
    // Should also remove any entries
    console.log('change values', control);
    //setFieldValue(`${control.relationshipId}.instances`, [], false);
    return null;
  }

  console.log('control', values, control.relationshipId);
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant="h5">
          {startCase(control.label)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        
        <FieldArray
          name={`${control.relationshipId}.instances`}
          render={arrayHelpers => (
            <Fragment>
              { get(values, `${control.relationshipId}.instances`, []).map((instance, index) => (
                <EntityRow key={index} index={index} tmpl={control.template.controls} instance={instance} parent={control} arrayHelpers={arrayHelpers}/>
              ))}
              <Wrapper>
                <Button onClick={() => arrayHelpers.push(control.template.values)} aria-label="add" variant="contained">
                  {control.addLabel || <AddCircleIcon />}
                </Button>
              </Wrapper>
            </Fragment>
          )}
        />

       </Grid>
    </Grid>
  )
}

//export { containmentControlInit}
export default RelationshipControl;