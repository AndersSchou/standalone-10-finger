// This is local environment used for https://10-finger-dev.com/.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  name: 'dev',
  production: false,
  availableLanguages: ['da-DK', 'nn-NO', 'nb-NO', 'sv-SE'],
  logLevel: NgxLoggerLevel.DEBUG,
  location: 'http://localhost:4200/',
  gameTime: '02:00',
  UrlEndpoints: {
    auth: 'https://signon-dev.vitec-mv.com',
    voiceservice: 'https://voiceservice-dev.vitec-mv.com',
    user: 'https://mvidsignonapi-dev.vitec-mv.com',
  }
};
