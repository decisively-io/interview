import React, {useEffect, Fragment} from 'react';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import styled from 'styled-components';

import { useTranslate } from '../i18n';

import {nextScreen, prevScreen, finishInterview } from '../redux/interviewActions';
import { renderControl, willRender } from './controls';
import set from 'lodash/set';
import omit from 'lodash/omit';
import getFetchHook from '../redux/getFetchHook';

//import { diff } from 'deep-object-diff';

import {
  Grid,
  Divider as MuiDivider,
  Button,
  CircularProgress
} from '@material-ui/core';
import { spacing } from "@material-ui/system";

const Divider = styled(MuiDivider)(spacing);

const ContainerGrid = styled(Grid)`
  height: 100%;
`;
// Get the override screen from children
const getScreen = (screenId, children) => {
  if (!children) return null;
  if (!Array.isArray(children)) {
    if (children.props.screenId == screenId) return children;
    else return null;
  }
  let result = children.filter((comp) => comp.props.screenId == screenId);
  if (!result || result.length === 0) return null;
  else return result[0];
}

const getControls = (controls, formik) => {
  return controls.map((control, index) => {
    // Check if this will actually be rendered
    if (!willRender(control, formik.values)) return null;
    return (
      <Grid item xs={12} key={index}>
        { renderControl(control, index) }
      </Grid>
    )
  })
}

//const BackBtn = 
const ScreenForm = ({id, screen, data, goal, children, readOnly}) => {
  const dispatch = useDispatch();
  const translate = useTranslate();

  const [initValues, updateInitValues] = React.useState();
  useEffect(() => {
    updateInitValues(data)
  }, [data]);
  if (!screen || !initValues) return null;

  
  const handleBack = (formik) => {
    formik.setSubmitting(true);
    dispatch(prevScreen(id, screen.previousScreen));
  }

  const handleHome = () => {
    dispatch(finishInterview(id, '/'));
  }

  const overrideScreen = getScreen(screen.id, children);


  const btnGroup = (formik) => {
    if (readOnly) return [];
    let buttons = [];
    
    if (screen.action === 'stop') return [<Button key="home" color="primary" variant="contained" onClick={handleHome}>{translate('interview.home')}</Button>];
    
    if (screen.previousScreen) buttons.push(<Button disabled={formik.isSubmitting} key="back" variant="contained" onClick={e => handleBack(formik)}>{translate('interview.back')}</Button>);
    if (screen.action === 'next') buttons.push(<Button key="next" disabled={formik.isSubmitting} variant="contained" color="primary" type="submit">{formik.isSubmitting && <CircularProgress size={24} />}{translate(screen.nextLabel || 'interview.next')}</Button>);
    else if (screen.action === 'submit') buttons.push(<Button key="submit" disabled={formik.isSubmitting} variant="contained" color="primary" type="submit">{translate(screen.submitLabel || 'interview.submit')}</Button>);
    
    return buttons;
  }
  return (
    <Formik
      initialValues={initValues} 
      enableReinitialize={true}
      onSubmit={(values, actions) => {
        if (screen.action === 'next' || screen.action === 'submit') {         
          // Send only changes to the server
          /*let changed = {};
          const fieldDiff = (fields, entity, index) => {
            Object.keys(fields).forEach((field) => {
              // Check each value to see if it's changed
              if (data[entity][field] !== values[entity][field]) {
                // Changed
                if (index) set(changed, `${entity}.${field}[${index}]`, values[entity][field]);
                else set(changed, `${entity}.${field}`, values[entity][field]);
              }
            });
          }
          Object.keys(data).forEach((entity) => {
            let fields = {};
            if (data[entity].instances) {
              // A relationship
              changed[entity] = omit(data[entity], 'instances');
              changed[entity].instances = [];
              data[entity].instances.forEach((instance, index) => {
                fieldDiff(instance, entity, index)
              })
            } else {
              fieldDiff(data[entity], entity);
            }
          })*/
          actions.setSubmitting(true);
          const info = {
            screenId: screen.id,
            goal: goal,
            data: values
          }
          console.log(info);
          //console.log('data', data);
          dispatch(nextScreen(id, info));
        }
        //return true;
      }}>
      { formik => (
        <form onSubmit={formik.handleSubmit}>
          <ContainerGrid container direction="column" align-items="stretch" justify="space-between" >
            <Grid item>
              <Grid container spacing={6}>
                  { overrideScreen ? React.cloneElement(overrideScreen, {
                    values: initValues, 
                    //buildControl: buildControl, 
                    screen: screen, 
                    formik: formik
                  }) : getControls(screen.controls, formik) }
              </Grid>
            </Grid>
            <Grid item>
              <Divider my={6} />
              <Grid container justify="space-between">
                  {btnGroup(formik).map((btn, index) => (
                    <Grid item key={index}>
                      {btn}
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </ContainerGrid>
        </form>
      )}
    </Formik>
  )
}

export default ScreenForm;