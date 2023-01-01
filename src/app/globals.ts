import { HttpHeaders } from '@angular/common/http'
import { Registry } from './models/Registry'
import { Settings } from './models/setting'
import { NotificationsService } from './services/notifications-service'

export class GLOBALS {

  public static registry: Registry = new Registry()
  public static user: string = null
  public static onRegistriesPage: boolean = false

  public static settings: Settings = new Settings()

  private static userType: string = null

  private static TOKEN_KEY = 'wx-package-mgr-access-token'

  public static setUser(user: string, notificationsService: NotificationsService, userType?: string): void {

    GLOBALS.user = user

    if (userType) {
      GLOBALS.userType = userType
    } else {
      GLOBALS.userType = user === 'Administrator' ? 'administrator' : 'other'
    }

    notificationsService.defaultEmail().subscribe((s) => {
      this.settings = s
    })
  }

  public static clearUser(): void {

    this.user = null
    this.userType = null
    this.settings = null
    GLOBALS.clearAccessToken()
  }

  public static cacheAccessToken(token: string): void {

    sessionStorage.setItem(GLOBALS.TOKEN_KEY, token)
  }

  public static getAccessToken(): string {

    return sessionStorage.getItem(GLOBALS.TOKEN_KEY)
  }

  public static clearAccessToken(): void {
    sessionStorage.removeItem(GLOBALS.TOKEN_KEY)
  }

  public static isAdministrator(): boolean {

    return GLOBALS.userType === 'administrator'
  }

  public static headers(): HttpHeaders {

    let headers: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Cache-Control', 'no-cache')
      .append('Cache-Control', 'no-store')
      .append('Pragma', 'no-cache')
      .append('Expires', '0')
      .append('Accept', 'application/json')

    if (GLOBALS.getAccessToken()) {
      headers = headers.append('accessToken', GLOBALS.getAccessToken())
    }

    return headers
  }
}
