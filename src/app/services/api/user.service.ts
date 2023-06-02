import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, Observable } from 'rxjs';
import { AccessIdentifiersResponseDTO, WhoAmIResponseDTO } from 'src/app/dto/whoami.dto';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';

/**
 * Service responsible of working with user.
 */
@Injectable()
export class UserService extends BaseService<WhoAmIResponseDTO> {
  // Represents the base url.
  private baseUrl: string;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param httpService Performs HTTP requests.
   * @param cookieService Reference to CookieService.
   */
  constructor(
    protected override httpService: HttpClient,
    protected override cookieService: CookieService,
  ) {
    super(httpService, cookieService);
    this.baseUrl = this.UrlEndpoints.user;
  }

  /**
   * Get user info.
   *
   * @returns An Observable of WhoAmIResponseDTO.
   */
  getUserInfo(): Observable<WhoAmIResponseDTO> {
    return this.get<WhoAmIResponseDTO>(
      `${this.baseUrl}/users/whoami`,
      false
    ).pipe(
      map((result) => {
        return result;
      })
    );
  }

  /**
   * Checks if the user has access to the app.
   *
   * @returns An array as AccessIdentifiersResponseDTO.
   */
  checkUserAccess(): Observable<AccessIdentifiersResponseDTO[]> {
    const body = [environment.accessIdentifier10finger];
    return this.put(`${this.baseUrl}/accessidentifiers`, body).pipe(
      catchError((error) => {
        throw error;
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  /**
   * Converts two letter region code to the language-region code format.
   *
   * @param regionCode Represents the selected language.
   *
   * @return The voice for the selected language.
   */
  convertRegionToLanguageIdentifier(regionCode: string): string {
    switch (regionCode) {
      case 'SE':
        return 'sv-SE';
      case 'NO':
        return 'nb-NO';
      default:
        return 'da-DK';
    }
  }
}
