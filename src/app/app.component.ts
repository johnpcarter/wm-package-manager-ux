import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { Subscription } from 'rxjs'

import { faCog, faUser, faUserSlash, faTools, faListAlt, faLifeRing, faCheck, faBrain } from '@fortawesome/free-solid-svg-icons'

import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'

import { Registry } from './models/Registry'

import { SettingsService } from './services/settings.service'
import { RegistriesService } from './services/registries.service'
import { NotificationsService } from './services/notifications-service'

import { PackagesServices } from './services/packages.service'

import { GLOBALS } from './globals'

@Component({
  selector: 'app-root',
  templateUrl: './components/templates/app.component.html'
})
export class AppComponent implements OnInit {

  public title: string = 'webMethods package Manager'
  public isConnectionPanelOpen: boolean = false

  public faCog = faCog
  public faUser = faUser
  public faUserSlash = faUserSlash
  public faTools = faTools
  public faListAlt = faListAlt
  public faCheck = faCheck
  public faLifeRing = faLifeRing
  public faBrain = faBrain

  // tslint:disable-next-line:variable-name
  private _sub: Subscription = null

  // tslint:disable-next-line:variable-name max-line-length
  constructor(private _inboundRouter: ActivatedRoute, private _router: Router, private _snackBar: MatSnackBar, private _dialog: MatDialog,  private _packagesServices: PackagesServices,
  // tslint:disable-next-line:variable-name max-line-length
              private _notificationsService: NotificationsService, private _settingsService: SettingsService, private _registriesService: RegistriesService) {

    console.log('loc ' + window.location.href)

    if (window.location.href.indexOf('registries') !== -1) {
      GLOBALS.onRegistriesPage = true
    }

    _settingsService.currentUser().subscribe((user) => {
      if (user) {
        GLOBALS.setUser(user, _notificationsService)
      }
    })

    _registriesService.getRegistry().subscribe((r) => {
      GLOBALS.registry = r
    })
  }

  public ngOnInit(): void {
  }

  public pageTitle(): string {

    if (!this.currentRegistry().default && !this.isOnRegistryPage()) {
      return this.currentRegistry().name
    } else {
      return 'registries'
    }
  }

  public menuTitle(): string {
    if (this.isConnected()) {
      return GLOBALS.user
    } else {
      return 'Anonymous'
    }
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

    this._settingsService.disconnect().subscribe((success) => {

      if (success) {
        GLOBALS.clearUser()
        this._snackBar.open('You have been disconnected successfully', 'Ok', {
          duration: 2000,
        })
        this._router.navigate(['/registries'])
      }
    })
  }

  public showConnectDialog(): void {

    this.isConnectionPanelOpen = true
  }

  public onConnectionDialogClose(result): void {
    this.isConnectionPanelOpen = false

    if (result) {
      if (GLOBALS.onRegistriesPage) {
        this._router.navigate(['/registries'])
      } else {
        this._router.navigate(['/packages'])
      }
    }
  }

  public showSettingsPanel(): void {

    if (this.isConnected()) {
      this._router.navigate(['/settings'])
    }
  }

  public showRegistries(): void {
    GLOBALS.onRegistriesPage = true
    this._router.navigate(['/registries'])
  }

  public onRegistriesPage(): boolean {
    return GLOBALS.onRegistriesPage
  }

  public currentRegistry(): Registry {
    if (!GLOBALS.registry) {
      GLOBALS.registry = new Registry()
    }

    return GLOBALS.registry
  }

  public search(value: string): void {

    this._packagesServices.searchPackages(value)
  }

  public clear(): void {
    this._packagesServices.searchPackages(null)
  }

  public isDefaultRegistry(): boolean {

    if (GLOBALS.registry) {
      return GLOBALS.registry.default
    } else {
      return false
    }
  }
}
