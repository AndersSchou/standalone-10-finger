// This is develop environment used for development on https://10-finger-dev.com/.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  name: 'dev',
  debugDraw: false,
  production: false,
  availableLanguages: ['da-DK', 'nb-NO', 'sv-SE'],
  logLevel: NgxLoggerLevel.DEBUG,
  location: 'https://10finger-dev.intowords.com/',
  gameTime: '02:00',
  UrlEndpoints: {
    auth: 'https://signon-dev.vitec-mv.com',
    voiceservice: 'https://voiceservice-dev.vitec-mv.com',
    user: 'https://mvidsignonapi-dev.vitec-mv.com',
  }
};
