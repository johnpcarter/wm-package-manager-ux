import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

import { environment } from '../../environments/environment'
import { GLOBALS } from '../globals'

import { Registry, RegistryType } from '../models/Registry'

@Injectable()
export class RegistriesService {

    private static REGISTERIES = 'registries'
    private static REGISTERY = 'registry'

    private static DEFAULT = '1'

  // tslint:disable-next-line:variable-name
    constructor(private _http: HttpClient) {

    }

    public getRegistry(name?: string): Observable<Registry> {

      let url: string = environment.BASE_API + RegistriesService.REGISTERY

      if (name) {
        url += '/' + encodeURIComponent(name)
      }

      const headers = GLOBALS.headers()

      return this._http.get(url, { headers })
        .pipe(catchError(error => {
          return of({registry: null})
        }))
        .pipe(map( (responseData: any) => {
          return responseData.registry
        }))
    }

    public registries(type?: RegistryType): Observable<Registry[]> {

      let url: string = environment.BASE_API + RegistriesService.REGISTERIES

      if (type) {
        url += '/' + type
      }

      const headers = GLOBALS.headers()

      return this._http.get(url, { headers })
        .pipe(catchError(error => {
          return of({registries: []})
        }))
        .pipe(map( (responseData: any) => {
        return responseData.registries
        }))
    }

    public createRegistry(registry: Registry): Observable<boolean> {

      const url: string = environment.BASE_API + RegistriesService.REGISTERY
      const headers = GLOBALS.headers()
      const body: string = JSON.stringify(registry)

      return this._http.post(url, body, { headers })
        .pipe(catchError(error => {
          return of({success: false})
        }))
        .pipe(map( (responseData: any) => {
          return responseData.success
        }))
    }

    public deleteRegistry(name: string): Observable<boolean> {

      const url: string = environment.BASE_API + RegistriesService.REGISTERY + '/' + encodeURIComponent(name)
      const headers = GLOBALS.headers()

      return this._http.delete(url, { headers })
        .pipe(catchError(error => {
          return of({success: false})
        }))
        .pipe(map( (responseData: any) => {
          return responseData.success
        }))
    }

    public setDefaultRegistry(name: string): Observable<boolean> {

      const url: string = environment.BASE_API + RegistriesService.REGISTERY + '/' + encodeURIComponent(name)
      const headers = GLOBALS.headers()

      return this._http.put(url, { headers })
        .pipe(catchError(error => {
          return of({success: false})
        }))
        .pipe(map( (responseData: any) => {
          return responseData.success
        }))
    }
}
