// This is test environment used for development on https://10-finger-test.com/.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  name: 'test',
  debugDraw: false,
  throwErrors: false,
  production: false,
  availableLanguages: ['da-DK', 'sv-SE', 'nb-NO'],
  logLevel: NgxLoggerLevel.OFF,
  location: 'https://10finger-test.intowords.com/',
  gameTime: '02:00',
  UrlEndpoints: {
    auth: 'https://signon-test.vitec-mv.com',
    voiceservice: 'https://voiceservice-test.vitec-mv.com',
    user: 'https://mvidsignonapi-test.vitec-mv.com',
  }
};
