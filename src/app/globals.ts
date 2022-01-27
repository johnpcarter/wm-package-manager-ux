import { HttpHeaders } from '@angular/common/http'
import { Registry } from './models/Registry'

export class GLOBALS {

  public static registry: Registry = new Registry()
  public static user: string = null
  public static userType: string = null

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
