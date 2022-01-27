import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { faCog, faUser, faUserSlash, faTools, faListAlt, faLifeRing, faCheck } from '@fortawesome/free-solid-svg-icons'

import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'

import { SettingsService } from './services/settings.service'

import { LoginComponent } from './components/login.component'

import { GLOBALS } from './globals'
import { Registry } from './models/Registry'
import { RegistriesService } from './services/registries.service'


@Component({
  selector: 'app-root',
  templateUrl: './components/templates/app.component.html'
})
export class AppComponent implements OnInit {

  public title: string = 'webMethods package Manager'

  public faCog = faCog
  public faUser = faUser
  public faUserSlash = faUserSlash
  public faTools = faTools
  public faListAlt = faListAlt
  public faCheck = faCheck
  public faLifeRing = faLifeRing

  // tslint:disable-next-line:variable-name max-line-length
  constructor(private _router: Router, private _snackBar: MatSnackBar, private _dialog: MatDialog, private _settings: SettingsService, private _registriesService: RegistriesService) {

    _settings.currentUser().subscribe((user) => {
      GLOBALS.user = user
      GLOBALS.userType = user === 'Administrator' ? 'administrator' : 'other'
    })

    _registriesService.getRegistry().subscribe((r) => {
      GLOBALS.registry = r
    })
  }

  public ngOnInit(): void {
  }

  public isConnected(): boolean {
    return GLOBALS.user != null
  }

  public isAdministrator(): boolean {
    return GLOBALS.isAdministrator()
  }

  public isOnRegistryPage(): boolean {
    return window.location.pathname.endsWith('/registries')
  }

  public disconnect(): void {

    this._settings.disconnect().subscribe((success) => {
      if (success) {
        GLOBALS.user = null
        this._snackBar.open('You have been disconnected successfully', 'Ok', {
          duration: 2000,
        })
      }
    })
  }

  public showConnectDialog(): void {

    const dialogRef = this._dialog.open(LoginComponent, {
      width: '500px',
      height: '400px',
    })

    dialogRef.afterClosed().subscribe(result => {
      this._router.navigate(['/registries'])
    })
  }

  public showSettingsPanel(): void {

    if (this.isConnected()) {
      this._router.navigate(['/settings'])
    }
  }

  colorForSettingsMenu(): any {

    if (this.isConnected()) {
      return {color: 'white'}
    } else {
      return {color: 'lightgray'}
    }
  }

  public showRegistries(): void {
    this._router.navigate(['/registries'])
  }

  public currentRegistry(): Registry {
    if (GLOBALS.registry) {
      return GLOBALS.registry
    } else {
      return new Registry()
    }
  }

  public isDefaultRegistry(): boolean {

    if (GLOBALS.registry) {
      return GLOBALS.registry.default
    } else {
      return false
    }
  }
}
