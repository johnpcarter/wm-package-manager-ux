import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {flatMap, mergeMap, Observable, of, switchMap, take} from 'rxjs';
import { map, catchError } from 'rxjs/operators'

import { GLOBALS } from '../globals'
import { Credentials } from '../models/Credentials'

import { environment } from '../../environments/environment'
import {AccessToken} from '../models/AccessToken';

@Injectable()
export class SettingsService {

  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) {

  }

  public connect(user: string, passswrd: string): Observable<string> {

    const url: string = environment.LOGIN_CONNECT

    const headers = GLOBALS.headers()
    const data = {username: user, password: passswrd}

    return this._http.post(url, data, { headers })
      .pipe(catchError(error => {
        return of(null)
      }))
      .pipe(map( (responseData: any) => {

        if (responseData && responseData.username !== 'Default') {
          // GLOBALS.cacheAccessToken(responseData.accessToken)
          return responseData.metadata.userType
        } else {
          return null
        }
      }))
  }

  public isEmpowerAvailable(): Observable<boolean> {

    const url: string = environment.EMPOWER_AVAILABLE

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        return of({bounce: false})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.bounce
      }))
  }

  public connectViaEmpower(username: string, passswrd: string): Observable<boolean> {

    const url: string = environment.EMPOWER_CONNECT

    const headers = GLOBALS.headers()
    const data = {user: username, password: passswrd}

    return this._http.post(url, data, { headers })
      .pipe(catchError(error => {
        return of(null)
      }))
      .pipe(map( (responseData: any) => {

        if (responseData) {
          GLOBALS.cacheAccessToken(responseData.accessToken)
          return true
        } else {
          return false
        }
      }))
  }

  public disconnect(): Observable<boolean> {

    return this.disconnectViaEmpower().pipe(mergeMap(success => {
      if (success) {
        return of(true)
      } else {
        return this.disconnectLocal()
      }
    }))
  }

  private disconnectLocal(): Observable<boolean> {

    const url: string = environment.LOGIN_DISCONNECT

    const headers = GLOBALS.headers()

    return this._http.post(url, '', { headers }).pipe(catchError(error => {
      return of(false)
    })).pipe(map( (responseData: any) => {
      if (typeof responseData === 'boolean') {
        return responseData
      } else {
        return true
      }
    }))
  }

  private disconnectViaEmpower(): Observable<boolean> {

    const url: string = environment.EMPOWER_DISCONNECT

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers }).pipe(catchError(error => {
      return of(false)
    })).pipe(map( (responseData: any) => {
      if (typeof responseData === 'boolean') {
        return responseData
      } else {
        return true
      }
    }))
  }

  public getAccessTokens(): Observable<AccessToken[]> {

    const url: string = environment.TOKENS

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        return of(null)
      }))
      .pipe(map( (responseData: any) => {

        if (responseData) {
          return responseData.tokens
        } else {
          return []
        }
      }))
  }

  public createAccessToken(label: string, numOfDays?: number): Observable<AccessToken> {

    let url: string = environment.TOKEN + label

    if (numOfDays) {
      url += '?numDays=' + numOfDays
    }

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers }).pipe(catchError(error => {
      return of(null)
    })).pipe(map( (responseData: any) => {
      if (responseData != null) {
        return new AccessToken(label, responseData.accessToken, numOfDays)
      } else {
        return null
      }
    }))
  }

  public deleteAccessToken(label: string): Observable<boolean> {

    const url: string = environment.TOKEN + label
    const headers = GLOBALS.headers()

    return this._http.delete(url, { headers }).pipe(catchError(error => {
      return of(false)
    })).pipe(map( (responseData: any) => {
      return responseData.success
    }))
  }

  public currentUser(): Observable<string> {

    const url: string = environment.LOGIN_SESSION

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers }).pipe(catchError(error => {
      GLOBALS.clearUser()
      return of(false)
    })).pipe(map( (responseData: any) => {
      if (responseData.userID) {
        return responseData.userID
      } else {
        GLOBALS.clearUser()
        return false
      }
    }))
  }

  public developerCredentials(): Observable<Credentials[]> {

    const url: string = environment.BASE_API + 'credentials'

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers }).pipe(map( (responseData: any) => {
        return responseData.credentials
      }))
  }

  public setDeveloperCredentials(src: string, id: string, tken: string): Observable<boolean> {

    const url: string = environment.BASE_API + 'credentials'

    const headers = GLOBALS.headers()
    const data = { source: src, user: id, token: tken}

    return this._http.post(url, data, { headers })
      .pipe(catchError(error => {
        return of(false)
      }))
      .pipe(map( (responseData: any) => {
        return responseData.success
      }))
  }

  public removeDeveloperCredentials(src: string, id: string): Observable<boolean> {

    const url: string = environment.BASE_API + 'credentials/' + encodeURIComponent(src) + '/' + id

    const headers = GLOBALS.headers()

    return this._http.delete(url, { headers })
      .pipe(catchError(error => {
        return of(false)
      }))
      .pipe(map( (responseData: any) => {
        return responseData
      }))
  }
 }
