// This is develop environment used for deveopment on https://cloudapp-dev.intowords.com/.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  name: 'prod',
  production: true,
  availableLanguages: ['da-DK', 'nn-NO', 'sv-SE', 'nb-NO'],
  logLevel: NgxLoggerLevel.OFF,
  location: 'http://localhost:4200/',
  UrlEndpoints: {
    auth: 'https://signon-dev.vitec-mv.com',
    voiceservice: 'https://voiceservice-dev.vitec-mv.com',
    user: 'https://mvidsignonapi-dev.vitec-mv.com',
  }
};
