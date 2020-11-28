import React, {Fragment, useEffect, useContext} from 'react';
import { useDispatch } from 'react-redux';
import SignatureCanvas from 'react-signature-canvas'
import {
  Typography,
  Button,
  CircularProgress as MuiCircularProgress
} from '@material-ui/core';
import get from 'lodash/get';
import { useFormikContext } from "formik";
import { checkHideRule, changeFieldValue } from './index';
import { loadAttachment } from '../../redux/interviewActions';
import getAttachmentHook from '../../redux/getAttachmentHook';
import InterviewContext from '../InterviewContext';

import styled from 'styled-components';

const SigWrapper = styled.div`
  border: 1px dashed gray;
  width: 300px;
  position: relative;
  min-height: 160px;
`;

const CircularProgress = styled(MuiCircularProgress)`
  position: absolute;
  left: 30%;
  top: 25%;
`;
const Signature = ({control, entity, count}) => {
  const { values, setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  let sigRef; 
  const interview = useContext(InterviewContext);
  const onChange = (event) => {
    // I think this attribute id is hard coded in OPA?
    let base64 = sigRef.toDataURL().split(',');
    changeFieldValue(setFieldValue, control.id, base64[1], entity, count);
  }
  let attachId = entity ? get(values, `${entity}.instances[${count}].${control.id}.attachmentId`) : get(values, `global.${control.id}.attachmentId`)

  let attachmentInfo = getAttachmentHook(interview.id, control.id);

  useEffect(() => {
    // Load the signature
    if (control.id && interview.id) dispatch(loadAttachment(interview.id, control.id));
  }, [interview.id, control.id, dispatch])

  useEffect(() => {
    // Check if the signature is returned - apply to the canvas
    if (attachmentInfo.value && sigRef) sigRef.fromDataURL(`data:image/png;base64,${attachmentInfo.value}`);
  }, [sigRef, attachmentInfo])
  const clearClick = () => {
    sigRef.clear();
  }
 // if (!interview.id) return <Typography>Signature controls are not rendered in read only mode</Typography>

  //let value = entity ? get(values, `${entity}.instances[${count}].${control.attributeId}.value`) : get(values, `global.${control.attributeId}.value`);
  
  if (!values) return null;
  if (checkHideRule(control, values)) return null;

  if (typeof attachId !== 'undefined' && (typeof attachmentInfo.value === 'undefined' || attachmentInfo.loading)) {
    // It has an attachment id (eg: it's been saved before) - but we are still loading
    return (
      <Fragment>
        <Typography>{control.label}</Typography>
        <SigWrapper>
          <CircularProgress size={100} />
        </SigWrapper>
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <Typography>{control.label}</Typography>
        <SigWrapper>
          <SignatureCanvas ref={(ref) => sigRef = ref} onEnd={onChange} />
          <Button variant="contained" onClick={clearClick}>Clear</Button>
        </SigWrapper>
      </Fragment>
    )
  }
}

export default Signature;