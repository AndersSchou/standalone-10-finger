// This is local environment used for testing locally on localhost.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  name: 'test',
  debugDraw: true,
  throwErrors: true,
  production: false,
  availableLanguages: ['da-DK', 'nb-NO', 'sv-SE'],
  logLevel: NgxLoggerLevel.DEBUG,
  location: 'http://localhost:4200/',
  gameTime: '01:30',
  UrlEndpoints: {
    auth: 'https://signon-test.vitec-mv.com',
    voiceservice: 'https://voiceservice-test.vitec-mv.com',
    user: 'https://mvidsignonapi-test.vitec-mv.com',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
