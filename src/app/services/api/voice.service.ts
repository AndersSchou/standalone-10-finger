import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { HttpClient } from '@angular/common/http';
import { SpeakBodyDTO, SpeakResultDTO } from 'src/app/dto/speak.dto';
import { BaseService } from './base.service';
import { CookieService } from 'ngx-cookie-service';

/**
 * Service responsible of working with voice api.
 */
@Injectable()
export class VoiceService extends BaseService<SpeakResultDTO> {
  private baseUrl: string;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param httpService Performs HTTP requests.
   * @param cookieService Reference to CookieService.
   * @param platform Instance of Platform.
   */
  constructor(
    protected override httpService: HttpClient,
    protected override cookieService: CookieService,
    private readonly platform: Platform
  ) {
    super(httpService, cookieService);
    this.baseUrl = this.UrlEndpoints.voiceservice;
  }

  /**
   * Speak request for a specified text.
   *
   * @param text The text to convert to speech.
   * @param voiceID Represents the voice ID of the speech.
   *
   * @returns An observable of SpeakResultDTO.
   */
  speak(
    text: string,
    voiceID: string,
    speechType?: string
  ): Observable<SpeakResultDTO> {
    console.log('----voiceID----', voiceID);
    const speakSettings = {
      format: (this.platform.SAFARI || this.platform.WEBKIT) ? 'mp3' : 'OGG',
      speed: 1,
      text,
      type: speechType ? speechType : 'TTS',
      voiceID,
    };
    return this.post<SpeakBodyDTO, SpeakResultDTO>(
      `${this.baseUrl}/v${this.API_VERSION}/Voice/Speak`,
      speakSettings
    ).pipe(
      map((result) => {
        const completePath = this.baseUrl + '/' + result.soundLink;
        result.soundLink = completePath;
        return result;
      })
    );
  }
}
