// This is develop environment used for development on https://10-finger-dev.com/.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  name: 'dev',
  debugDraw: false,
  throwErrors: true,
  production: false,
  availableLanguages: ['da-DK', 'nb-NO', 'nn-NO', 'sv-SE'],
  logLevel: NgxLoggerLevel.DEBUG,
  location: 'https://10-finger-dev.intowords.com/',
  gameTime: '01:30',
  accessIdentifier10finger: 'product.all.ml.10finger.upgradeable',
  UrlEndpoints: {
    auth: 'https://signon-dev.vitec-mv.com',
    voiceservice: 'https://voiceservice-dev.vitec-mv.com',
    user: 'https://mvidsignonapi-dev.vitec-mv.com',
  }
};
