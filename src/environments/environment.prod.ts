// This is production environment used for production on https://10-finger.com/.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  name: 'prod',
  production: true,
  availableLanguages: ['da-DK', 'nn-NO', 'sv-SE', 'nb-NO'],
  logLevel: NgxLoggerLevel.OFF,
  location: 'http://localhost:4200/',
  UrlEndpoints: {
    auth: 'https://signon.vitec-mv.com',
    voiceservice: 'https://voiceservice.vitec-mv.com',
    user: 'https://mvidsignonapi.vitec-mv.com',
  }
};
