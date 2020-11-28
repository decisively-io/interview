import React, {Fragment} from "react";
import { useDispatch } from 'react-redux';
import {
  Step,
  StepLabel,
  Stepper,
  StepContent
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import {prevScreen } from '../redux/interviewActions';
import filter from 'lodash/filter';
import { useTranslate } from '../i18n';
import styled from "styled-components";


const VerticalStepper = styled(Stepper)`
  background-color: transparent;
  .MuiStepLabel-label {
    color: white;
  }
  .MuiSvgIcon-root {
    color: white;
  }
  .MuiSvgIcon-root.MuiStepIcon-root.MuiStepIcon-active {
    color: #1976d2;
  }
  .MuiSvgIcon-root:not(.MuiStepIcon-active) text {
    fill: black;
  }
`; 

const SubStepList = styled.ul`
  padding-inline-start: 0;
  margin-block-end: 0;
  .MuiStepLabel-labelContainer {
    cursor: pointer;
    margin-bottom: 10px;
  }
  .MuiStepLabel-label.MuiStepLabel-active {
    font-weight: 900;
  }
`;



const InterviewStep = ({step}) => {
  const handleStepClick = (e) => {
    console.log(e);

  }
  return (
    <Step completed={step.completed}>
      <StepLabel>{step.title || 'Unknown'}</StepLabel>
    </Step>
  );
}


const ProgressSteps = ({releaseId, stages, displayScreens, children, orientation="horizontal"}) => {
  let activeStep = 0, subActiveStep = 0;
  var steps = [];
  var sub_steps = [];
  const dispatch = useDispatch();
  const translate = useTranslate();

  const handleClick = (step) => {
    dispatch(prevScreen(releaseId, step.goal));
  }

  let stageCompleted;
  stages.forEach((stage, index) => {
    
    //if (stage.attributes['is-current'] === 'true') 
    stageCompleted = false;
    if (displayScreens && stage.current) {
      activeStep = index;
      subActiveStep = false;
      let stepCount = -1;
      stage.steps.forEach((step, step_index) => {
        if (!step.willShow) return null;
        stepCount++;
        if (step.current) subActiveStep = stepCount;

        let error = false;
        if (step.visited && !step.complete) {
          error = true;
        }
        sub_steps.push({
          title: translate(`screen.${step.title}`),
          completed: step.visited && step.complete,
          error: error,
          goal: step.goal,
          id: step.id
        });
      })      
    } else {
      // Previous screen, check if its completed
      let completeSteps = filter(stage.steps, { complete: true, visited: true});
      stageCompleted = completeSteps.length === stage.steps.length ? true : false;
    }
    steps.push({
      title: translate(`stage.${stage.title}`),
      completed: stageCompleted,
      current: stage.current
    });
  })
  if (children) return children({steps, activeStep, sub_steps, subActiveStep});
  else if (orientation === 'vertical') {
    return (
      <VerticalStepper activeStep={activeStep} orientation={orientation}>
        {steps.map((step, index) => (
          <Step key={index} completed={step.completed}>
            <StepLabel>{step.title}</StepLabel>
              {sub_steps.length > 1 && step.current && (
                <StepContent>
                  <SubStepList>
                    {sub_steps.map((step, index) => (
                      <StepLabel key={index} active={subActiveStep === index} onClick={() => handleClick(step)}>
                        {step.title}
                      </StepLabel>))}
                  </SubStepList>
                </StepContent>
              )}
          </Step>
        ))}
      </VerticalStepper>
    )
  } else {
    return (
      <Fragment>
        <Stepper activeStep={activeStep} orientation={orientation}>
          {steps.map((step, index) => (
            <Step key={index} completed={step.completed}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {sub_steps.length > 1 && (
          <Stepper activeStep={subActiveStep} orientation={orientation}>
            {sub_steps.map((step, index) => (
              <Step key={index} completed={step.completed} onClick={() => handleClick(step)}>
                <StepLabel>{step.title}</StepLabel>
              </Step>))}
          </Stepper>
        )}
      </Fragment>
    )
  }
}

export default ProgressSteps;
