import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

import { GLOBALS } from '../globals'
import { Credentials } from '../models/Credentials'

import { environment } from '../../environments/environment'

@Injectable()
export class SettingsService {

  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) {

  }

  public connect(user: string, passswrd: string): Observable<boolean> {

    const url: string = environment.LOGIN_CONNECT

    const headers = GLOBALS.headers()
    const data = {username: user, password: passswrd}

    return this._http.post(url, data, { headers })
      .pipe(catchError(error => {
        return of(false)
      }))
      .pipe(map( (responseData: any) => {

        if (responseData &&  responseData.metadata) {
          GLOBALS.userType = responseData.metadata.userType
          return true
        } else {
          return false
        }
      }))
  }

  public disconnect(): Observable<boolean> {

    const url: string = environment.LOGIN_DISCONNECT

    const headers = GLOBALS.headers()

    return this._http.post(url, '', { headers }).pipe(catchError(error => {
      return of(false)
    })).pipe(map( (responseData: any) => {
      return responseData || true
    }))
  }

  public currentUser(): Observable<string> {

    const url: string = environment.LOGIN_SESSION

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers }).pipe(catchError(error => {
      return of(false)
    })).pipe(map( (responseData: any) => {
      return responseData.userID
    }))
  }

  public developerCredentials(): Observable<Credentials[]> {

    const url: string = environment.BASE_API + 'credentials'

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers }).pipe(map( (responseData: any) => {
        return responseData.credentials
      }))
  }

  public setDeveloperCredentials(src: string, id: string, token: string): Observable<boolean> {

    const url: string = environment.BASE_API + 'credentials'

    const headers = GLOBALS.headers()
    const data = { source: src, user: id, token: token}

    return this._http.post(url, data, { headers })
      .pipe(catchError(error => {
        return of(false)
      }))
      .pipe(map( (responseData: any) => {
        return responseData
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
