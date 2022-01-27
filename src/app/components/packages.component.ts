import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTable } from '@angular/material/table'

import { faKey, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

import { Registry } from '../models/Registry'
import { Package } from '../models/Package'

import { PackagesServices } from '../services/packages.service'
import { RegistriesService } from '../services/registries.service'

import { PackageDetailsComponent } from './package-details.component'

import { GLOBALS } from '../globals'
import {AddPackageComponent} from './add-package.component'

@Component({
  selector: 'app-packages',
  templateUrl: './templates/packages.component.html'
})
export class PackagesComponent implements OnInit {
  public faKey = faKey

  public displayedColumns: string[] = ['auth', 'name', 'category', 'description', 'registered']

  public registry: Registry | undefined
  public searchTerm: string | undefined
  public data: Package[] = []

  // tslint:disable-next-line:variable-name
  private _isSearching: boolean = false
  // tslint:disable-next-line:variable-name
  private _allPackagesFilter: string = null

  @ViewChild('package', {read: MatTable}) packagesTable: MatTable<Package>  | undefined

  // tslint:disable-next-line:variable-name
  private _allPackages: Package[] = []

  // tslint:disable-next-line:variable-name max-line-length
  constructor(private _router: Router, private _activatedRoute: ActivatedRoute, private _dialog: MatDialog, private _packagesServices: PackagesServices, private _registriesServices: RegistriesService) {

    this._activatedRoute.paramMap.subscribe(params => {

      _registriesServices.getRegistry(params.get('id')).subscribe((r) => {

        GLOBALS.registry = r

        this._registriesServices.getRegistry(GLOBALS.registry.name).subscribe((r) => {
          this.registry = r
          GLOBALS.registry = r

          this.load()
        })
      })
    })
  }

  public ngOnInit(): void {

  }

  public registryDescription(): string {
    if (this.registry) {
      return this.registry.description
    } else {
      return ''
    }
  }
  search(value: string): void {

    // @ts-ignore
    this.data = this._allPackages.filter((val) => val.name.toLowerCase().includes(value.toLowerCase()))

    // if we have =50 rows, let's do a fresh search with given filter

    if (!this._isSearching && this._allPackages.length === 50) {
      this._isSearching = true
      this._packagesServices.packages(value, GLOBALS.registry.name).subscribe((p) => {
        this._allPackages = p
        this.data = p
        this._isSearching = false
        this._allPackagesFilter = value

        console.log('all packages now filtered by ' + this._allPackagesFilter)
      })
    }

  }

  public showPackageDetails(p: Package): boolean  {

    const dialogRef = this._dialog.open(PackageDetailsComponent, {
      width: '80%',
      height: '1100px',
      data: {
        package: p,
      },
    })

    dialogRef.afterClosed().subscribe(result => {
      this.load()
    })

    return false
  }

  public truncate(description: string): string {

    if (description && description.length > 80) {
      return description.substring(0, 80) + '...'
    } else {
      return description
    }
  }

  public isAdministrator(): boolean {
    return GLOBALS.isAdministrator()
  }

  private load(): void {
    this._packagesServices.packages(null, GLOBALS.registry.name).subscribe((p) => {
      console.log('here we are ' + p.length)
      this._allPackages = p
      this.data = p

      if (this.packagesTable) {
        this.packagesTable.renderRows()
      }
    })
  }
}
