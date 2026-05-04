// This is local environment used for testing locally on localhost.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  name: 'test',
  version: require('../../package.json').version,
  debugDraw: true,
  throwErrors: true,
  production: false,
  availableLanguages: ['da-DK', 'nb-NO', 'nn-NO', 'sv-SE', 'nl-NL'],
  logLevel: NgxLoggerLevel.DEBUG,
  location: 'http://localhost:4200/',
  gameTime: '01:30',
  accessIdentifier10finger: 'product.all.ml.10finger.upgradeable',
  UrlEndpoints: {
    auth: 'https://signon.vitec-mv.com',
    voiceservice: 'https://voiceservice.vitec-mv.com',
    user: 'https://mvidsignonapi.vitec-mv.com',
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
