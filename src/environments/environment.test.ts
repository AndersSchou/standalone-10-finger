// This is test environment used for development on https://10-finger-test.com/.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  name: 'test',
  production: false,
  availableLanguages: ['da-DK', 'nn-NO', 'sv-SE', 'nb-NO'],
  logLevel: NgxLoggerLevel.OFF,
  location: 'http://localhost:4200/',
  UrlEndpoints: {
    auth: 'https://signon-test.vitec-mv.com',
    voiceservice: 'https://voiceservice-test.vitec-mv.com',
    user: 'https://mvidsignonapi-test.vitec-mv.com',
  }
};
