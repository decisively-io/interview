import React, {useEffect, Fragment} from "react";
import { useDispatch } from 'react-redux';

import InterviewContext from './InterviewContext';
import getInterviewHook from '../redux/getInterviewHook';
import {startInterview} from '../redux/interviewActions';
import ProgressBar from './ProgressBar';
import ProgressSteps from './ProgressSteps';
import ScreenForm from './ScreenForm';
import ScreenErrors from './ScreenErrors';
import { useTranslate, useSetLocale } from '../i18n';


import styled from "styled-components";

import {
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Typography,
  Fab,
  Menu
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Skeleton from '@material-ui/lab/Skeleton';
//import TranslateIcon from '@material-ui/icons/Translate';
import TranslationBtn from './TranslationBtn';

const PageWrapper = styled.div`
  padding: 40px;
  height: 100%;
  form {
    height: 95%;
  }
`;


const ContainerGrid = styled(Grid)`
  height: 100%;
`;

const ScreenTitle = styled(Typography)`
  margin-bottom: 20px;
`;

const TranslateFab = styled(Fab)`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const SideWrapper = styled.div`
  background-color: ${props => props.theme.sidebar.background};
  background-size: cover;
  height: 100%;
  .MuiSkeleton-root {
    background-color: rgba(255, 255, 255, 0.11)
  }
`;

const Interview = ({id}) => {
  //const [translateEl, setTranslateEl] = React.useState(null);
  //const [userLocale, setUserLocale] = React.useState(null);
  const translate = useTranslate();
  //const setLocale = useSetLocale();

  const dispatch = useDispatch();
  const interview = getInterviewHook(id);
  useEffect(() => {
    if (id) dispatch(startInterview(id));
  }, [dispatch, id]);

  /*useEffect(() => {
    if (!userLocale && interview && interview.i18n) {
      setUserLocale('en');
    }
  }, [interview])*/

  /*const translateClick = (event) => {
    setTranslateEl(event.currentTarget);
  }*/
  /*const changeLang = (locale) => {
    setUserLocale(locale);
    setLocale(locale, interview.i18n);
    setTranslateEl(null);
  };*/
  if (!interview || !interview.screen) return (
    <ContainerGrid container>
      <Grid item xs={12} md={9}>
        <PageWrapper>
            <Skeleton style={{ paddingLeft: '100px', marginTop: 10 }} variant="rect" width="40%" height={30} />
            <Skeleton style={{ paddingLeft: '100px', marginTop: 40 }} variant="rect" width="90%" height={30} />
            <Skeleton style={{ paddingLeft: '100px', marginTop: 15 }} variant="rect" width="90%" height={30} />
            <Skeleton style={{ paddingLeft: '100px', marginTop: 15 }} variant="rect" width="90%" height={30} />
        </PageWrapper>
      </Grid>
      <Grid item xs={12} md={3} component={SideWrapper}>
        <ContainerGrid container direction="column" align-items="stretch" justify="space-between" >
          <Grid item>
            <div>
              <Skeleton variant="circle" style={{marginLeft: 40, marginTop: 40, float: 'left'}} width={40} height={40} />
              <Skeleton style={{ marginLeft: 10, marginTop: 45, float: 'left' }} variant="rect" width="40%" height={30} />
            </div>
            <div style={{clear: 'both'}}>
              <Skeleton variant="circle" style={{marginLeft: 40, marginTop: 10, float: 'left'}} width={40} height={40} />
              <Skeleton style={{ marginLeft: 10, marginTop: 15, float: 'left' }} variant="rect" width="40%" height={30} />
            </div>
            <div style={{clear: 'both'}}>
              <Skeleton variant="circle" style={{marginLeft: 40, marginTop: 10, float: 'left'}} width={40} height={40} />
              <Skeleton style={{ marginLeft: 10, marginTop: 15, float: 'left' }} variant="rect" width="40%" height={30} />
            </div>
          </Grid>
          <Grid item>
            <Grid container>
              <Grid item xs={9}>
                <Skeleton variant="rect" width="90%" height={30} />
              </Grid>
              <Grid item xs={3}>
                <Skeleton variant="rect" width="90%" height={30} />
              </Grid>
            </Grid>
          </Grid>
        </ContainerGrid>
      </Grid>
    </ContainerGrid>
  );
  return (
    <InterviewContext.Provider value={{id: id, interview: interview}}>
      <ContainerGrid container>
        <Grid item xs={12} md={9}>
          <PageWrapper>
            <ScreenErrors errors={interview.screen.errors || []} type="error"/>
            <ScreenErrors errors={interview.screen.warnings || []} type="warning"/>

            <ScreenTitle variant="h2">{translate(`screen.${interview.screen.title}`)}</ScreenTitle>
            <ScreenForm id={id} data={interview.data} screen={interview.screen} goal={interview.goal} />
          </PageWrapper>
        </Grid>
        <Grid item xs={12} md={3} component={SideWrapper}>
          <ContainerGrid container direction="column" align-items="stretch" justify="space-between" >
            <Grid item>
              <ProgressSteps orientation="vertical" stages={interview.progress.stages} releaseId={id} displayScreens={interview.screen.showScreens || true}/>
            </Grid>
            <Grid item>
              <Grid container>
                <Grid item xs={9}>
                  <ProgressBar stages={interview.progress.stages}/>
                </Grid>
                <Grid item xs={3}>
                  <TranslationBtn id={id} langs={interview.langs} />
                </Grid>
              </Grid>
            </Grid>
          </ContainerGrid>
        </Grid>
      </ContainerGrid>
    </InterviewContext.Provider>
  )

}

export default Interview;