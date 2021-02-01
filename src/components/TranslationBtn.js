import React, {Fragment, useEffect} from 'react';
import { useDispatch } from 'react-redux';

import {
  IconButton,
  Fab,
  Menu,
  MenuItem,
  CircularProgress
} from '@material-ui/core';
import TranslateIcon from '@material-ui/icons/Translate';
import { useTranslate, useSetLocale, useLocale, } from '../i18n';
import { loadLanguage } from '../redux/interviewActions';
import getLanguageHook from '../redux/getLanguageHook';
import getLanguagesHook from '../redux/getLanguagesHook';

import styled from "styled-components";
/*
const TranslateFab = styled(Fab)`
  position: absolute;
  top: 16px;
  right: 16px;
`;
*/

const languageNames = {
  af: 'Afrikaans',
  ar: 'Arabic',
  as: 'Assamese',
  bn: 'Bangla',
  bs: 'Bosnian (Latin)',
  bg: 'Bulgarian',
  yue: 'Cantonese (Traditional)',
  ca: 'Catalan',
  'zh-Hans': 'Chinese Simplified',
  'zh-Hant': 'Chinese Traditional',
  'hr': 'Croatian',
  cs: 'Czech',
  prs: 'Dari',
  da: 'Danish',
  nl: 'Dutch',
  en: 'English',
  et: 'Estonian',
  fj: 'Fijian',
  fil: 'Filipino',
  fi: 'Finnish',
  fr: 'French',
  'fr-ca': 'French (Canada)',
  de: 'German',
  el: 'Greek',
  gu: 'Gujarti',
  ht: 'Haitian Creole',
  he: 'Hebrew',
  hi: 'Hindi',
  mww: 'Hmong Daw',
  hu: 'Hungarian',
  is: 'Icelandic',
  id: 'Indonesian',
  ga: 'Irish',
  it: 'Italian',
  ja: 'Japanese',
  kn: 'Kannada',
  kk: 'Kazakh',
  'tlh-Latin': 'Klingon',
  'tlh-Piqd': 'Klingon (plqaD)',
  ko: 'Korean',
  ku: 'Kurdish (Central)',
  kmr: 'Kurdish (Northern)',
  lv: 'Latvian',
  lt: 'Lithuanian',
  mg: 'Malagasy',
  ms: 'Malay',
  ml: 'Malayalam',
  mt: 'Maltese',
  mi: 'Maori',
  mr: 'Marathi',
  nb: 'Norwegian',
  or: 'Odia',
  ps: 'Pashto',
  fa: 'Persian',
  pl: 'Polish',
  'pt-br': 'Portuguese (Brazil)',
  'pt-pt': 'Portuguese (Portugal)',
  pa: 'Punjabi',
  otq: 'Queretaro Otomi',
  ro: 'Romanian',
  ru: 'Russian',
  sm: 'Samoan',
  'sr-Cyrl': 'Serbian (Cyrillic)',
  'sr-Latn': 'Serbian (Latin)',
  sk: 'Slovak',
  sl: 'Slovenian',
  es: 'Spanish',
  sw: 'Swahili',
  sv: 'Sweden',
  ty: 'Tahitian',
  ta: 'Tamil',
  te: 'Telugu',
  th: 'Thai',
  to: 'Tongan',
  tr: 'Turkish',
  uk: 'Ukraine',
  ur: 'Urdu',
  vi: 'Vietnamese',
  cy: 'Welsh',
  yua: 'Yucatec Maya'
}
const TranslateContainer = styled.div`
  .MuiButtonBase-root{
    border-radius: 0;
    border: 1px solid #dcd5d5;
    color: #dcd5d5;
    padding: 6px;
    margin-top: 12px;
  }
`;

const TranslationBtn = ({langs, id}) => {
  const [translateEl, setTranslateEl] = React.useState(null);
  const [curLanguage, setCurLanguage] = React.useState('en');
  const [loading, setLoading] = React.useState(false);
  const translate = useTranslate();
  const setLocale = useSetLocale();
  const curLocale = useLocale();
  const dispatch = useDispatch();
  const translateClick = (event) => {
    setTranslateEl(event.currentTarget);
  }
  let language = getLanguageHook(curLanguage);
  let allLanguages = getLanguagesHook();

  useEffect(() => {
    if (curLocale !== curLanguage) {
      let i18n = {};
      i18n[curLanguage] = language, 
      setLocale(curLanguage, i18n);
      setLoading(false);
    }
  }, [language])
  const changeLang = (locale) => {
    setLoading(true);
    //setUserLocale(locale);
    // Download the language (if we don't already have it)
    setCurLanguage(locale);
    if (allLanguages && allLanguages[locale]) {
      setLocale(locale, allLanguages);
    } else {
      dispatch(loadLanguage(locale, id))
    }
    //setLocale(locale, i18n);
    setTranslateEl(null);
  };

  if (!langs) return null;

  return (
    <TranslateContainer>
      { loading ? <CircularProgress /> : (
        <Fragment>
          <IconButton color="secondary" aria-label="Language Select" onClick={translateClick}>
            <TranslateIcon />
          </IconButton>  
          <Menu
            anchorEl={translateEl}
            keepMounted
            open={Boolean(translateEl)}
            onClose={() => setTranslateEl(null)}
            >
            { langs.map((lang, index) => <MenuItem key={index} onClick={() => changeLang(lang)}>{languageNames[lang]}</MenuItem>)}
          </Menu>
        </Fragment>
      )}
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