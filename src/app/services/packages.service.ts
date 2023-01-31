import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {BehaviorSubject, Observable, of} from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { environment } from '../../environments/environment'
import { GLOBALS } from '../globals'

import {Package, PackageStat, TagSummary} from '../models/Package';
import { Tag } from '../models/Tag'
import { GitInfo } from '../models/GitInfo'
import { Manifest } from '../models/Manifest'

export enum VoteResult {
  success,
  refused,
  canceled
}

@Injectable()
export class PackagesServices {

  private static PACKAGES = 'packages'
  private static PACKAGE = 'package'

  private packagesSource = new BehaviorSubject([])
  public packages: Observable<Package[]> = this.packagesSource.asObservable()

  // tslint:disable-next-line:variable-name
  private _allPackages: Package[] = []
  // tslint:disable-next-line:variable-name
  private _fetching: boolean = false
  // tslint:disable-next-line:variable-name
  private _allPackagesFilter: string = null
  // tslint:disable-next-line:variable-name
  private _currentCategory: string = null

  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) {
  }

  public categories(registry?: string): Observable<string[]> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/categories'

    if (registry && registry !== undefined) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        this._fetching = false
        return of({categories: []})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.categories
      }))
  }

  public searchPackages(value: string, category?: string, reset?: boolean): void {

    if (reset || !this._fetching) {
      // if we have more results than 50, mayhap we have applicable candidates in DB, so fetch from backing-store
      if (reset || !this._allPackages || this._allPackages.length === 50 || category !== this._currentCategory) {
        this._currentCategory = category
        this.fetchPackages(value, GLOBALS.registry.name, category).subscribe((p) => {
          this.packagesSource.next(p)

          console.log('all packages now filtered by ' + this._allPackagesFilter)
        })
      } else if (value) {
        // filter in memory results
        this.packagesSource.next(this._allPackages.filter((val) =>
          val.packageName.toLowerCase().includes(value.toLowerCase()))) // || val.description.toLowerCase().includes(value.toLowerCase())))
      } else {
        this.packagesSource.next(this._allPackages)
      }
    }
  }

  public fetchPackages(filter: any, registry: string, category?: string): Observable<Package[]> {

    this._fetching = true

    let url: string = environment.BASE_API + PackagesServices.PACKAGES

    if (filter) {
      url += '/' + encodeURIComponent('%' + filter + '%')
    }

    if (registry && registry !== undefined) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    if (category) {
      if (registry && registry !== undefined) {
        url += '&category=' + encodeURIComponent(category)
      } else {
        url += '?category=' + encodeURIComponent(category)
      }
    }

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        this._fetching = false
        this._allPackagesFilter = filter

        return of({packages: [null]})
      }))
      .pipe(map( (responseData: any) => {
        this._allPackages = responseData.packages
        this._allPackagesFilter = filter

        if (registry != null) {
          GLOBALS.registry.name = registry
        }
        this._fetching = false
        return responseData.packages
      }))
  }

  public package(packageName: string, registry?: string): Observable<Package> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/info'

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

  public tags(packageName: string, registry?: string): Observable<TagSummary[]> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/tags'

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        return of({})
      }))
      .pipe(map( (responseData: any) => {
          return responseData.availableTags
        },
        error => {
          return []
        }))
  }

  public gitInfo(packageName: string, registry?: string): Observable<GitInfo> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/git'

    if (registry && registry !== undefined) {
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

    if (registry && registry !== undefined) {
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

    if (registry && registry !== undefined) {
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

    if (registry && registry !== undefined) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    return this._http.post(url, body, { headers })
      .pipe(catchError(error => {
        return of({success: false})
      }))
      .pipe(map( (responseData: any) => {

        if (!this._allPackages) {
          this._allPackages = []
        }

        this._allPackages.push(pckg)
        this.packagesSource.next(this._allPackages)
        return responseData.success
      }))
  }

  public setVisibility(packageName: string, isVisible: boolean, registry?: string): Observable<boolean> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/visibility/' + isVisible

    if (registry && registry !== undefined) {
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

    if (registry && registry !== undefined) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.put(url, '', { headers })
      .pipe(catchError(error => {
        return of(false)
      }))
      .pipe(map( (responseData: any) => {
        return typeof responseData === 'boolean' ? responseData : true
      }))
  }

  public upVote(packageName: string, registry?: string): Observable<VoteResult> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/vote'

    if (registry && registry !== undefined) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.post(url, {},{ headers })
      .pipe(catchError(error => {
        return of({success: false})
      }))
      .pipe(map( (responseData: any) => {

        if (responseData.success) {
          if (responseData.canceledVote) {
            return VoteResult.canceled
          } else {
            return VoteResult.success
          }
        } else {
          return VoteResult.refused
        }
      }))
  }

  public downVote(packageName: string, registry?: string): Observable<VoteResult> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/vote'

    if (registry && registry !== undefined) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.delete(url,{ headers })
      .pipe(catchError(error => {
        return of({success: false})
      }))
      .pipe(map( (responseData: any) => {
        if (responseData.success) {
          if (responseData.canceledVote) {
            return VoteResult.canceled
          } else {
            return VoteResult.success
          }
        } else {
          return VoteResult.refused
        }
      }))
  }

  public removePackage(packageName: string, registry?: string): Observable<boolean> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName)

    if (registry && registry !== undefined) {
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

    if (registry && registry !== undefined) {
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

  public getPackageReadme(packageName: string, tag?: string, registry?: string): Observable<string> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/readme'

    if (tag) {
      url += '/' + + encodeURIComponent(tag)
    }

    if (registry && registry !== undefined) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        return of({})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.readme
      }))
  }

  public getPackageManifest(packageName: string, tag?: string, registry?: string): Observable<Manifest> {

    let url: string = environment.BASE_API + PackagesServices.PACKAGE + '/' + encodeURIComponent(packageName) + '/manifest'

    if (tag) {
      url += '/' + + encodeURIComponent(tag)
    }

    if (registry && registry !== undefined) {
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

    if (registry && registry !== undefined) {
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

    if (registry && registry !== undefined) {
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

    if (registry && registry !== undefined) {
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

    if (registry && registry !== undefined) {
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
