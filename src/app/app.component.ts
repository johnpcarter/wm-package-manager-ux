import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {Subscription} from 'rxjs'

import {faBrain, faCheck, faCog, faLifeRing, faListAlt, faTools, faUser, faUserSlash} from '@fortawesome/free-solid-svg-icons'

import {MatSnackBar} from '@angular/material/snack-bar'
import {MatDialog} from '@angular/material/dialog'

import {Registry, RegistryType} from './models/Registry'

import {SettingsService} from './services/settings.service'
import {RegistriesService} from './services/registries.service'
import {NotificationsService} from './services/notifications-service'

import {PackagesServices} from './services/packages.service'

import {GLOBALS} from './globals'

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
      GLOBALS.currentPage = 'registries'
    }

    this._inboundRouter.queryParams.subscribe(params => {

      if (!GLOBALS.registry.name) {
        _registriesService.getRegistry(params['registry']).subscribe((r) => {
          if (r) {
            GLOBALS.registry = r
          }})
      }
    })

    this.checkForConnectedUser()
  }

  public ngOnInit(): void {
  }

  public pageTitle(): string {

    if (GLOBALS.currentPage === 'registries') {
      return 'Registries'
    } else if (GLOBALS.currentPage === 'settings') {
      return 'Settings'
    } else if (this.currentRegistry().name && this.currentRegistry().name !== 'default') {
      return this.currentRegistry().name
    } else {
      return ''
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
    return GLOBALS.currentPage === 'registries'
  }

  public disconnect(): void {

    this._settingsService.disconnect().subscribe((success) => {

      if (success) {
        GLOBALS.clearUser()
        this._snackBar.open('You have been disconnected successfully', 'Ok', {
          duration: 2000,
        })

        if (GLOBALS.registry.type === RegistryType.private) {
          GLOBALS.currentPage = 'registries'
          this._router.navigate(['/registries'], {skipLocationChange: true})
        }
      }
    })
  }

  public showConnectDialog(): void {

    this.isConnectionPanelOpen = true
  }

  public onConnectionDialogClose(result): void {
    this.isConnectionPanelOpen = false

    if (result) {
      this.checkForConnectedUser()
    }
  }

  public classForPackagesLink(): string {

    if (!this.isOnRegistryPage()) {
      return 'dlt-tab-item-selected'
    } else {
      return 'm'
    }
  }

  public classForRegistriesLink(): string {

    if (this.isOnRegistryPage()) {
      return 'dlt-tab-item-selected'
    } else {
      return 'dlt-tab-item'
    }
  }

  public showSettingsPanel(): void {

    if (this.isConnected()) {
      GLOBALS.currentPage = 'settings'
      this._router.navigate(['/settings'], {skipLocationChange: true})
    }
  }

  public showPackages(): boolean {
    GLOBALS.currentPage = 'packages'
    this._router.navigate(['/packages'], {skipLocationChange: true})

    return false
  }

  public showRegistries(): boolean {
    GLOBALS.currentPage = 'registries'
    this._router.navigate(['/registries'], {skipLocationChange: true})

    return false
  }

  public onRegistriesPage(): boolean {
    return GLOBALS.currentPage === 'registries'
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

  private checkForConnectedUser(): void {

    this._settingsService.currentUser().subscribe((user) => {
      if (user) {
        if (GLOBALS.user !== user) {
          GLOBALS.setUser(user, this._notificationsService)
        }
      } else {
        GLOBALS.clearUser()
      }
    })
  }
}
