import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { environment } from '../../environments/environment'
import { GLOBALS } from '../globals'

import { Package, PackageStat } from '../models/Package'
import { Tag } from '../models/Tag'
import { GitInfo } from '../models/GitInfo'
import { Manifest } from '../models/Manifest'

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

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName)

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

  public gitInfo(packageName: string, registry?: string): Observable<GitInfo> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/git'

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

  public history(packageName: any, registry: string, category?: string): Observable<PackageStat[]> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/history'

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        return of({values: []})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.values
      }))
  }

  public users(packageName: any, registry: string, category?: string): Observable<string[]> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/users'

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        return of({user: []})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.users
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

  public setVisibility(packageName: string, isVisible: boolean, registry?: string): Observable<boolean> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/visibility/' + isVisible

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.put(url, '', { headers })
      .pipe(catchError(error => {
        return of({success: false})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.success
      }))
  }

  public migratePackage(packageName: string, toRegistry: string, registry?: string): Observable<boolean> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/move/' + toRegistry

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.put(url, '', { headers })
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

  public getPackageManifest(packageName: string, tag?: string, registry?: string): Observable<Manifest> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/manifest'

    if (tag) {
      url += '/' + + encodeURIComponent(tag)
    }

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

  public syncUser(packageName: string, user: string, registry?: string): Observable<boolean> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName)
      + '/user/' + user

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.post(url, '', { headers })
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
