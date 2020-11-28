import React, {Fragment} from 'react';
import {
  IconButton,
  Fab,
  Menu,
  MenuItem
} from '@material-ui/core';
import TranslateIcon from '@material-ui/icons/Translate';
import { useTranslate, useSetLocale } from '../i18n';
import styled from "styled-components";
/*
const TranslateFab = styled(Fab)`
  position: absolute;
  top: 16px;
  right: 16px;
`;
*/
const TranslateContainer = styled.div`
  .MuiButtonBase-root{
    border-radius: 0;
    border: 1px solid #dcd5d5;
    color: #dcd5d5;
    padding: 6px;
    margin-top: 12px;
  }
`;

const TranslationBtn = ({i18n}) => {
  const [translateEl, setTranslateEl] = React.useState(null);
  const translate = useTranslate();
  const setLocale = useSetLocale();
  
  const translateClick = (event) => {
    setTranslateEl(event.currentTarget);
  }
  const changeLang = (locale) => {
    setUserLocale(locale);
    setLocale(locale, interview.i18n);
    setTranslateEl(null);
  };


  if (!i18n) return null;

  return (
    <TranslateContainer>
      <IconButton color="secondary" aria-label="Language Select" onClick={translateClick}>
        <TranslateIcon />
      </IconButton>  
      <Menu
        anchorEl={translateEl}
        keepMounted
        open={Boolean(translateEl)}
        onClose={() => setTranslateEl(null)}
        >
        { Object.keys(i18n).map((lang, index) => <MenuItem key={index} onClick={() => changeLang(lang)}>{lang}</MenuItem>)}
      </Menu>
    </TranslateContainer>
  )
}

/*
{interview.i18n && (
          <Fragment>
            <TranslateFab color="primary" aria-label="Language Select" onClick={translateClick}>
              <TranslateIcon />
            </TranslateFab>  
            <Menu
              anchorEl={translateEl}
              keepMounted
              open={Boolean(translateEl)}
              onClose={() => setTranslateEl(null)}
              >
              { Object.keys(interview.i18n).map((lang, index) => <MenuItem key={index} onClick={() => changeLang(lang)}>{lang}</MenuItem>)}
            </Menu>
          </Fragment>
        )}*/

export default TranslationBtn;