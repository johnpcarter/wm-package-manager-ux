import { HttpHeaders } from '@angular/common/http'
import { Registry } from './models/Registry'
import { Settings } from './models/setting'
import { NotificationsService } from './services/notifications-service'

export class GLOBALS {

  public static registry: Registry = new Registry()
  public static user: string = null
  public static settings: Settings = new Settings()

  private static userType: string = null


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
  }

  public static isAdministrator(): boolean {

    return GLOBALS.userType === 'administrator'
  }

  public static headers(): HttpHeaders {

    const headers: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Cache-Control', 'no-cache')
      .append('Cache-Control', 'no-store')
      .append('Pragma', 'no-cache')
      .append('Expires', '0')
      .append('Accept', 'application/json')

    return headers
  }
}
