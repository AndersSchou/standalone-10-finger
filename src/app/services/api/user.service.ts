import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { WhoAmIResponseDTO } from 'src/app/dto/whoami.dto';
import { BaseService } from './base.service';

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
}
