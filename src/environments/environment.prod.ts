// This is production environment used for production on https://10-finger.com/.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  name: 'prod',
  debugDraw: false,
  throwErrors: false,
  production: true,
  availableLanguages: ['da-DK', 'nb-NO', 'nn-NO', 'sv-SE'],
  logLevel: NgxLoggerLevel.OFF,
  location: 'https://10finger.intowords.com/',
  gameTime: '01:30',
  accessIdentifier10finger: 'product.all.ml.10finger.upgradeable',
  UrlEndpoints: {
    auth: 'https://signon.vitec-mv.com',
    voiceservice: 'https://voiceservice.vitec-mv.com',
    user: 'https://mvidsignonapi.vitec-mv.com',
  }
};
