import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { environment } from '../../environments/environment'
import { GLOBALS } from '../globals'

import { Package } from '../models/Package'
import { Tag } from '../models/Tag'

@Injectable()
export class PackagesServices {

  private static PACKAGES = 'packages'
  private static PACKAGE = 'package'

  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) {

  }

  public packages(filter: any, registry: string, category?: string): Observable<Package[]> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGES

    if (filter) {
      url += '/' + encodeURIComponent(filter)
    }

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    if (category) {
      if (registry) {
        url += '&category=' + encodeURIComponent(category)
      } else {
        url += '?category=' + encodeURIComponent(category)
      }
    }

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        return of({packages: []})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.packages
      }))
  }

  public package(packageName: string, registry?: string): Observable<Package> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/details'

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        return of({})
      }))
      .pipe(map( (responseData: any) => {
        return responseData
      },
      error => {
        return []
      }))
  }

  public createPackage(pckg: Package, registry?: string): Observable<boolean> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE
    const headers = GLOBALS.headers()
    const body: string = JSON.stringify(pckg)

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    return this._http.post(url, body, { headers })
      .pipe(catchError(error => {
        return of({success: false})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.success
      }))
  }

  public removePackage(packageName: string, registry?: string): Observable<boolean> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName)

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.delete(url, { headers })
      .pipe(catchError(error => {
        return of({success: false})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.success
      }))
  }

  public getTag(packageName: string, tag: string, registry?: string): Observable<Tag> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName)
      + '/tag/' + encodeURIComponent(tag)

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        return of({})
      }))
      .pipe(map( (responseData: any) => {
        return responseData
      }))
  }

  public trust(packageName: string, tag: string, sig?: string, registry?: string): Observable<boolean> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName)
                      + '/tag/' + encodeURIComponent(tag)

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    let data = {}

    if (sig) {
      data = {signature: sig}
    }

    const headers = GLOBALS.headers()

    return this._http.post(url, data, { headers })
      .pipe(catchError(error => {
        return of({success: false})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.success
      }))
  }

  public untrust(packageName: string, tag: string, registry?: string): Observable<boolean> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName)
      + '/tag/' + encodeURIComponent(tag)

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.delete(url, { headers })
      .pipe(catchError(error => {
        return of({success: false})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.success
      }))
  }

  public updateUsers(packageName: string, usrs: string[], registry?: string): Observable<boolean> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName)
      + '/users'

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()
    const data = {users: usrs}

    return this._http.post(url, data, { headers })
      .pipe(catchError(error => {
        return of({success: false})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.success
      }))
  }
}
