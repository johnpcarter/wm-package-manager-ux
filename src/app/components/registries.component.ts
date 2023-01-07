import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'

import { faBuilding, faGlobeAfrica, faTrashAlt, faCheckCircle, faPlusSquare, faCircle } from '@fortawesome/free-solid-svg-icons'

import { RegistriesService } from '../services/registries.service'
import { Registry, RegistryType } from '../models/Registry'
import { GLOBALS } from '../globals'

@Component({
  selector: 'app-registries',
  templateUrl: './templates/registries.component.html'
})
export class RegistriesComponent implements OnInit {

  public faGlobeAfrica = faGlobeAfrica
  public faBuilding = faBuilding
  public faTrashAlt = faTrashAlt
  public faCheckCircle = faCheckCircle
  public faPlusSquare = faPlusSquare
  public faCircle = faCircle

  public addRegistryClicked: boolean = false

  // tslint:disable-next-line:variable-name
  private _registries: Registry[] = []
  // tslint:disable-next-line:variable-name
  private _isConnected: boolean

  // tslint:disable-next-line:variable-name max-line-length
  constructor(private _router: Router, private _registriesService: RegistriesService, private _snackbar: MatSnackBar) {
  }

  ngOnInit(): void {

    this._isConnected = this.isConnected()
    this.load()
  }

  public registries(): Registry[] {

    if (this._isConnected !== this.isConnected()) {
      this._isConnected = this.isConnected()
      this.load()
    }

    return this._registries
  }

  public showPackagesInRegistry(registry: Registry): void {

    GLOBALS.onRegistriesPage = false
    GLOBALS.registry = registry
    this._router.navigate([''], {
      queryParams: { registry: registry.name },
      queryParamsHandling: 'merge', skipLocationChange: true })
  }

  public isPrivate(r: Registry): boolean {
    return r.type === RegistryType.private
  }

  public isAdministrator(): boolean {
    return GLOBALS.isAdministrator()
  }

  public setDefaultForRegistry(r: Registry): void {

    if (!this.isAdministrator()) {
      return
    }

    this._registriesService.setDefaultRegistry(r.name).subscribe((success) => {
      if (success) {
        this.load()
        if (GLOBALS.registry.name === r.name) {
          GLOBALS.registry.default = true
        }
      }
    })
  }

  public addRegistry(): void {

    this.addRegistryClicked = true
  }

  public addRegistryCompleted(success: boolean): void {
    this.addRegistryClicked = false
  }

  public removeRegistry(r: Registry): void {

    if (this.isAdministrator()) {

      let confirm: boolean = false

        if (confirm) {
          this._registriesService.deleteRegistry(r.name).subscribe((success) => {
            if (success) {
              this.load()
            } else {
              this._snackbar.open('update failed', 'Dismiss', {
                duration: 2000,
              })
            }
          })
        }
    } else {
      // do nothing

    }
  }

  public isConnected(): boolean {
    return GLOBALS.user != null
  }

  private load(): void {
    this._registries = []

    this._registriesService.registries().subscribe((r) => {
      this._registries = r
    })
  }

  public classForIsDefaultAvailable(r: Registry): string {
    if (r.default) {
      return 'disabled'
    } else {
      return null
    }
  }

  public editRegistry(r: Registry): void {

  }
}
