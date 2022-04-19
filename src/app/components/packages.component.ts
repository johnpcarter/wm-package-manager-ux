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
  public faPlusSquare = faPlusSquare

  public displayedColumns: string[] = ['auth', 'name', 'category', 'description', 'registered', 'downloads']

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

    this._activatedRoute.queryParams
      .subscribe(params => {
        this.setRegistry(params['registry'], params['package'])
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

  public search(value: string): void {

    // @ts-ignore
    // tslint:disable-next-line:max-line-length
    this.data = this._allPackages.filter((val) => val.packageName.toLowerCase().includes(value.toLowerCase()) || val.description.toLowerCase().includes(value.toLowerCase()))

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

  public truncate(description: string , length?: number): string {

    if (!length) {
      length = 120
    }
    if (description && description.length > length) {
      return description.substring(0, length) + '...'
    } else {
      return description
    }
  }

  public isAdministrator(): boolean {
    return GLOBALS.isAdministrator()
  }

  public addPackage(): void {

    if (!this.isAdministrator()) {
      return
    }

    const dialogRef = this._dialog.open(AddPackageComponent, {
      width: '80%',
      height: '1000px',
      data: {
        registry: GLOBALS.registry
      },
    })

    dialogRef.afterClosed().subscribe(result => {
      this.load()
    })
  }

  private setRegistry(registry: string, packageName?: string): void {

    console.log(' ======== got ' + registry + ', ' + packageName)

    this._registriesServices.getRegistry(registry).subscribe((r) => {

      this.registry = r
      GLOBALS.registry = r
      this.load(packageName)
    })
  }

  private load(packageName?: string): void {
    this._packagesServices.packages(null, GLOBALS.registry.name).subscribe((packages) => {
      this._allPackages = packages
      this.data = packages

      if (this.packagesTable) {
        this.packagesTable.renderRows()
      }

      if (packageName != null) {
        let found: Package = null

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < packages.length; i++) {
          if (packages[i].packageName === packageName) {
            found = packages[i]
            break
          }
        }

        if (found != null) {
          this.showPackageDetails(found)
        }
      }
    })
  }
}
