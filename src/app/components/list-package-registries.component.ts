import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { faTimes, faRocket } from '@fortawesome/free-solid-svg-icons'

import { RegistriesService } from '../services/registries.service'
import { PackagesServices } from '../services/packages.service'

import { Registry } from '../models/Registry'
import { Package } from '../models/Package'

import { GLOBALS } from '../globals'

@Component({
  selector: 'app-remove-asset',
  templateUrl: './templates/list-package-registries.component.html'
})
export class ListPackagesRegistriesComponent implements OnInit {

  public faRocket = faRocket
  public faTimes = faTimes

  public selectedItem: string = null
  public isPackageList: boolean = false

  public items: string[] = []
  public registries: Registry[]
  public packages: Package[]

  public ref: string
  public omitList: string[] = []

  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name max-line-length
  constructor(dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private _packagesService: PackagesServices, private _registriesService: RegistriesService) {
    this._dialogRef = dialogRef
    this.omitList = data.omitList || []
    this.ref = data.ref

    this.loadRegistries()
  }

  ngOnInit(): void {
  }

  public onNoClick(): void {
    this._dialogRef.close()
  }

  public confirm(): void {

    if (this.isPackageList) {
      this._dialogRef.close({package: this.selectedItem})
    } else {
      this._dialogRef.close({registry: this.selectedItem})
    }
  }

  public toggleListType(): void {

    if (!this.isPackageList) {
      this.isPackageList = true
      this.loadPackages()
    } else {
      this.isPackageList = false
      this.loadRegistries()
    }
  }

  private loadPackages(): void {

    this.items = []
    this.selectedItem = null

    if (this.packages) {
      this.packages.forEach((p) => {
        this.items.push(p.packageName)
      })
    } else {
      this._packagesService.fetchPackages(null, GLOBALS.registry.name).subscribe((p) => {
        this.packages = []
        p.forEach((pk) => {

          if (this.omitList.indexOf(pk.packageName) === -1) {
            this.packages.push(pk)
            this.items.push(pk.packageName)
          }
        })
      })
    }
  }

  private loadRegistries(): void {

    this.items = []
    this.selectedItem = null

    if (this.registries) {

      this.registries.forEach((r) => {
        this.items.push(r.name)
      })
    } else {
      this._registriesService.registries().subscribe((r) => {

        this.registries = []

        r.forEach((rp) => {

          if (this.omitList.indexOf(rp.name) === -1) {
            this.registries.push(rp)
            this.items.push(rp.name)
          }
        })
      })
    }
  }
}
