import { enableProdMode, ErrorHandler, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AuthInterceptor } from './app/services/guards/auth-interceptor.service';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient, HttpClient } from '@angular/common/http';
import { GlobalErrorHandler } from './app/services/global-error-handler.service';
import { CourseHelperService } from './app/services/course-helper.service';
import { LevelService } from './app/services/level.service';
import { UserService } from './app/services/api/user.service';
import { SpeechService } from './app/services/speech.service';
import { VoiceService } from './app/services/api/voice.service';
import { SettingsService } from './app/services/settings.service';
import { CustomIconService } from './app/services/custom-icon.service';
import { AuthGuardService } from './app/services/guards/auth-guard.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './app/services/auth.service';
import { GridService } from './app/services/grid.service';
import { ErrorModalService } from './app/services/error-modal.service';
import { LanguageHelperService } from './app/services/language.service';

if (environment.production) {
  enableProdMode();
}

// TranslateHttpLoader is used to load the translations automatically.
// AoT requires an exported function for factories.
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json?cb=' + environment.version);
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
          BrowserModule,
          AppRoutingModule,
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
        })),
        GridService,
        AuthService,
        CookieService,
        AuthGuardService,
        CustomIconService,
        SettingsService,
        VoiceService,
        SpeechService,
        UserService,
        LevelService,
        CourseHelperService,
        ErrorModalService,
        LanguageHelperService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
