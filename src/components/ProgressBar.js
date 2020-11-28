import React, {Fragment} from "react";
import {
  LinearProgress,
  Typography
} from '@material-ui/core';
import styled from "styled-components";

const BarWrapper = styled.div`
  width: 100%;
  padding: 15px;
`;
const ProgressHeader = styled(Typography)`
  color: white;
  padding-bottom: 10px;
`
const ProgressBar = ({stages}) => {
  
  let totalScreens = 0;
  let visited = 0;
  stages.forEach((stage, index) => {
    stage.steps.forEach((step, step_index) => {
      if (!step.willShow) return;
      totalScreens++;
      if (step.complete) visited++;
    });
  });
  let progress = visited / totalScreens * 100;
  return (
    <BarWrapper>
      <ProgressHeader variant="h5">Progress</ProgressHeader>
      <LinearProgress variant="determinate" value={progress} />
    </BarWrapper>
  );
}

export default ProgressBar;
