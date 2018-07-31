/*
 * @Author: Keith-CY
 * @Date: 2018-07-22 21:38:14
 * @Last Modified by:   Keith-CY
 * @Last Modified time: 2018-07-22 21:38:14
 */

import * as i18n from 'i18next'
import * as XHR from 'i18next-xhr-backend'
import * as LanguageDetector from 'i18next-browser-languagedetector'
import { reactI18nextModule } from 'react-i18next'

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    keySeparator: false,
    react: {
      wait: false,
    },
  })

export default i18n
