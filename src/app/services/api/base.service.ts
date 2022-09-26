import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

/**
 * Base service that implements basic auth and req logic.
 */
@Injectable()
export class BaseService<T> {
  protected readonly API_VERSION = 1;

  // Reference to URL endpoints located in environment.
  protected readonly UrlEndpoints = environment.UrlEndpoints;

  /**
   * We inject all the services that correspond to all implemented adapters.
   *
   * @param httpService Performs HTTP requests.
   * @param cookieService Reference to CookieService.
   */
  constructor(
    protected readonly httpService: HttpClient,
    protected readonly cookieService: CookieService
  ) { }

  /**
   * Generates the default header required by the api.
   *
   * @param timestamp The timestamp of the request.
   */
  generateHTTPHeader(
    timestamp: string
  ): { [header: string]: string } {
    return {
      sessionid: this.cookieService.get('mvf_session_id'),
      requestdatetime: timestamp,
      'Content-Type': 'application/json',
      accept: 'application/json',
    };
  }

  /**
   * Makes a get request.
   *
   * @param url The url of the request.
   * @param isJson Marks if the response is a json or not. Defaults to true.
   * @param isPdfResponse Marks if the response is a pdf resource or not. Defaults to false.
   */
  protected get<R>(url: string): Observable<R>;
  protected get<S>(url: string, isJson: boolean): Observable<S>;
  protected get(
    url: string,
    isJson: boolean,
    isPdfResponse: boolean
  ): Observable<{ body: ArrayBuffer }>;
  protected get<S>(url: string, isJson: boolean, isPdfResponse: boolean, lang: string): Observable<S>;
  protected get(
    url: string,
    isJson = true,
    isPdfResponse = false,
    lang = ''
  ): Observable<T | { body: ArrayBuffer }> {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const headers = Object.assign(this.generateHTTPHeader(timestamp), {
      Accepts: 'application/json' + (isPdfResponse ? ', application/pdf' : ''),
      language: lang
    });
    return this.httpService
      .get<T>(url, {
        headers,
        observe: isPdfResponse ? ('response' as 'body') : 'body',
        responseType: isPdfResponse ? ('arraybuffer' as 'json') : 'json',
      })
      .pipe(
        map(
          (res: T | { body: T }): T => {
            if (isJson && 'body' in res) {
              return res.body;
            }
            return res as T;
          }
        )
      );
  }

  /**
   * Makes a post request.
   *
   * @param url The url of the request.
   * @param body The body of the request.
   */
  protected post<R, S>(url: string, body: R): Observable<S>;
  protected post<S, R>(
    url: string,
    body: S,
    extraHeaders: { [header: string]: string }
  ): Observable<R>;
  protected post<R>(
    url: string,
    body: R,
    extraHeaders: { [header: string]: string } = {}
  ): Observable<T> {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const stringBody = JSON.stringify(body);
    const headers = Object.assign(
      this.generateHTTPHeader(timestamp),
      extraHeaders
    );
    return this.httpService
      .post<T>(url, stringBody, { headers })
      .pipe(map((res: T) => res));
  }

  /**
   * Make an update request.
   *
   * @param url The url of the request.
   * @param body The body for the request that will be updated.
   * @param pageID Represents the page id.
   * @param pageStatus Represents the page status.
   */
  protected put<S>(url: string, body: S): Observable<T>;
  protected put<S, R>(
    url: string,
    body: S,
    pageID: { [header: string]: string },
    pageStatus: { [header: string]: string }
  ): Observable<R>;
  protected put<R>(
    url: string,
    body: R,
    pageID: { [header: string]: string } = {},
    pageStatus: { [header: string]: string } = {}
  ): Observable<T> {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const headers = Object.assign(
      this.generateHTTPHeader(timestamp),
      pageID,
      pageStatus
    );
    const stringBody = JSON.stringify(body);

    return this.httpService
      .put<T>(url, stringBody, { headers })
      .pipe(map((res: T) => res));
  }

  /**
   * Make a Delete request.
   *
   * @param url The url of the request.
   */
  protected delete(url: string): Observable<T> {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const headers = this.generateHTTPHeader(timestamp);
    return this.httpService.delete<T>(url, { headers });
  }
}
