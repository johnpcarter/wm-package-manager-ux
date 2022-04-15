import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'

import { faBuilding, faGlobeAfrica, faTrashAlt, faCheckCircle, faPlusSquare, faCircle } from '@fortawesome/free-solid-svg-icons'

import { RegistriesService } from '../services/registries.service'
import { Registry, RegistryType } from '../models/Registry'
import { GLOBALS } from '../globals'
import { RemoveConfirmationComponent } from './remove-confirmation.component'
import { AddRegistryComponent } from './add-registry.component'
import { AddPackageComponent } from './add-package.component'

@Component({
  selector: 'app-registries',
  templateUrl: './templates/registries.component.html'
})
export class RegistriesComponent implements OnInit {

  public registries: Registry[] = []
  public faGlobeAfrica = faGlobeAfrica
  public faBuilding = faBuilding
  public faTrashAlt = faTrashAlt
  public faCheckCircle = faCheckCircle
  public faPlusSquare = faPlusSquare
  public faCircle = faCircle

  // tslint:disable-next-line:variable-name max-line-length
  constructor(private _router: Router, private _registriesService: RegistriesService, private _dialog: MatDialog, private _snackbar: MatSnackBar) {

    this.load()
  }

  ngOnInit(): void {
  }

  public showPackagesInRegistry(registry: string): void {
    this._router.navigate([''], {
      queryParams: { registry: registry },
      queryParamsHandling: 'merge' })
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

    if (this.isAdministrator()) {
      const dialogRef = this._dialog.open(AddRegistryComponent, {
        width: '400px',
        height: '600px'
      })

      dialogRef.afterClosed().subscribe(result => {
        this.load()
      })
    }
  }

  public removeRegistry(r: Registry): void {

    if (this.isAdministrator()) {
      const dialogRef = this._dialog.open(RemoveConfirmationComponent, {
        width: '50%',
        height: '250px',
        data: {
          ref: r.name
        }
      })

      dialogRef.afterClosed().subscribe(result => {

        if (result.confirm) {
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
      })

    } else {
      // do nothing

    }
  }

  private load(): void {
    this._registriesService.registries().subscribe((r) => {
      this.registries = r
    })
  }
}
