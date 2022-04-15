import { Injectable} from '@angular/core'
import { HttpClient} from '@angular/common/http'
import { Observable, of} from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { NewPackageNotification } from '../models/new-package-notification'

import { environment } from '../../environments/environment'
import { GLOBALS } from '../globals'
import { Settings } from '../models/setting'

@Injectable()
export class NotificationsService {

  private static NOTIFICATIONS = 'notifications'
  private static NOTIFICATION = 'notification'

  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) {

  }

  public updateDefaultEmail(email: string): Observable<boolean> {

    let url: string = environment.BASE_API + 'notification/email'

    if (email != null) {
        url += '/' + encodeURIComponent(email)
    }

    const headers = GLOBALS.headers()

    if (email) {
      return this._http.put(url, '', { headers }).pipe(catchError(error => {
        return of(false)
      })).pipe(map( (responseData: any) => {
        return true
      }))
    } else {
      return this._http.delete(url, { headers }).pipe(catchError(error => {
        return of(false)
      })).pipe(map( (responseData: any) => {
        return true
      }))
    }
  }

  public defaultEmail(): Observable<Settings> {

    const url: string = environment.BASE_API + 'notification/email'

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers }).pipe(catchError(error => {
      return of({email: null})
    })).pipe(map( (responseData: any) => {
      return {email: responseData.email}
    }))
  }

  public notifications(registry?: string): Observable<NewPackageNotification[]> {

    let url: string = environment.BASE_API + NotificationsService.NOTIFICATIONS

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()

    return this._http.get(url, { headers })
      .pipe(catchError(error => {
        return of({packages: []})
      }))
      .pipe(map( (responseData: any) => {
        return responseData.notifications
      }))
  }

  // tslint:disable-next-line:max-line-length
  public addPackageNotification(packageName: string, friendlyName: string, emailAddress: string, registry?: string): Observable<NewPackageNotification> {
    return this.addNotification(new NewPackageNotification(packageName, true, friendlyName, emailAddress), registry)
  }

  public addRegistryNotification(registry: string, friendlyName: string, emailAddress: string): Observable<NewPackageNotification> {
    return this.addNotification(new NewPackageNotification(registry, false, friendlyName, emailAddress), registry)
  }

  public addNotification(notification: NewPackageNotification, registry?: string): Observable<NewPackageNotification> {

    let url: string = environment.BASE_API + NotificationsService.NOTIFICATION
    notification.registry = registry

    if (registry) {
      url += '?registry=' + encodeURIComponent(registry)
    }

    const headers = GLOBALS.headers()
    const data = JSON.stringify(notification)

    return this._http.post(url, data, { headers })
      .pipe(catchError(error => {
        return of({ success: false})
      }))
      .pipe(map( (responseData: any) => {
        if (responseData.success) {
          return notification
        } else {
          return null
        }
      }))
  }

  public removeNotification(asset: string, isPackage: boolean, registry?: string): Observable<boolean> {

    let url: string = environment.BASE_API + NotificationsService.NOTIFICATION + '/' + encodeURIComponent(asset)

    url += '?isPackage=' + isPackage

    if (registry) {
      url += '&registry=' + encodeURIComponent(registry)
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
}
