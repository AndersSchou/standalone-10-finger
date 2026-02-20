// This is test environment used for development on https://10-finger-test.com/.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  name: 'test',
  version: require('../../package.json').version,
  debugDraw: false,
  throwErrors: false,
  production: false,
  availableLanguages: ['da-DK', 'nb-NO', 'nn-NO', 'sv-SE', 'nl-NL'],
  logLevel: NgxLoggerLevel.OFF,
  location: 'https://10-finger-test.intowords.com/',
  gameTime: '01:30',
  accessIdentifier10finger: 'product.all.ml.10finger.upgradeable',
  UrlEndpoints: {
    auth: 'https://signon.test.vitecmv.com',
    voiceservice: 'https://voiceservice.test.vitecmv.com',
    user: 'https://mvidsignonapi.test.vitecmv.com',
  }
};
