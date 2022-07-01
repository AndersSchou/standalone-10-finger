import { AuthInterceptor } from './services/guards/auth-interceptor.service';
import { environment } from 'src/environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppLoginComponent } from './modules/login/login.component';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppHomeComponent } from './modules/home/home.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// TranslateHttpLoader is used to load the translations automatically.
// AoT requires an exported function for factories.
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AppLoginComponent,
    AppHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // Logger config based on environment.
    LoggerModule.forRoot({
      level: !environment.production
        ? environment.logLevel
          ? environment.logLevel
          : NgxLoggerLevel.LOG
        : NgxLoggerLevel.OFF,
      // serverLogLevel
      serverLogLevel: NgxLoggerLevel.OFF,
    }),
  ],
  providers: [
    AuthService,
    CookieService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
