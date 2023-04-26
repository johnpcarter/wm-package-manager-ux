import {ActivatedRoute, Router} from '@angular/router'
import {Component, OnInit, ViewChild} from '@angular/core'

import { MatDialog } from '@angular/material/dialog'
import { MatTable } from '@angular/material/table'

import { faKey, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

import { Package } from '../models/Package'

import { PackagesServices } from '../services/packages.service'
import { RegistriesService } from '../services/registries.service'

import { GLOBALS } from '../globals'

@Component({
  selector: 'app-packages',
  templateUrl: './templates/packages.component.html'
})
export class PackagesComponent implements OnInit {
  public faKey = faKey
  public faPlusSquare = faPlusSquare

  public displayedColumnsDefault: string[] = ['auth', 'name', 'category', 'description', 'registered', 'downloads', 'votes']
  public displayedColumnsExclCategory: string[] = ['auth', 'name', 'description', 'registered', 'downloads', 'votes']

  public filter: string = null
  public categories: string[] = []
  public currentCategory: string = null
  public currentFilter: string = null
  public packages: Package[] = []

  public altRegistry: string = undefined
  public end: string = undefined

  public searchTerm: string | undefined

  public addPackageClicked: boolean = false

  @ViewChild('package', {read: MatTable}) packagesTable: MatTable<Package>  | undefined

  // tslint:disable-next-line:variable-name max-line-length
  constructor(private _router: Router, private _activatedRoute: ActivatedRoute, private _dialog: MatDialog, private _packagesServices: PackagesServices, private _registriesServices: RegistriesService) {

    this._activatedRoute.queryParams
      .subscribe(params => {
        // @ts-ignore
        this.load(params.registry, params.package)
      })

    // listen out for changes

    this._packagesServices.packages.subscribe((p) => {
      this.packages = p

      if (this.packagesTable) {
        this.packagesTable.renderRows()
      }
    })
  }

  public ngOnInit(): void {

  }

  public load(registry: string, packageName?: string): void {

    this._packagesServices.categories(registry).subscribe((c) => {
      this.categories = c
    })

    this._packagesServices.fetchPackages(null, registry, this.currentCategory).subscribe((p) => {
      if (!p) {
        this.packages = []
      } else if (p.length === 1 && p[0] == null) {
        GLOBALS.currentPage = 'login'
        if (registry !== undefined) {
          this._router.navigate(['/login', registry], {skipLocationChange: true})
        } else {
          this._router.navigate(['/login'], {skipLocationChange: true})
        }
      } else {
        this.packages = p
      }
    })
  }

  public displayedColumns(): string[] {
    if (this.currentCategory) {
      return this.displayedColumnsExclCategory
    } else {
      return this.displayedColumnsDefault
    }
  }

  public isSelectedCategory(category: string): any {

    if (this.currentCategory === category) {
      return {'background-color': '#1C5569', 'color': 'white', 'margin-right': '8px'}
    } else {
      return {'margin-right': '8px'}
    }
  }

  public setCategory(category: string): void {
    this.currentCategory = category
    this._packagesServices.searchPackages(this.currentFilter, this.currentCategory)
  }

  public search(value: string): void {

    this.currentFilter = value
    this._packagesServices.searchPackages(value, this.currentCategory)
  }

  public clear(): void {
    this.currentFilter = null
    this._packagesServices.searchPackages(null, this.currentCategory, true)
  }

  public registryDescription(): string {
      let d: string = GLOBALS.registry.description || ''

      if (d.indexOf('%') !== -1) {
        const start = d.indexOf('%')
        let registry = d.substring(start + 1)
        d = d.substring(0, start)

        const end = registry.indexOf('%')
        if (end !== -1) {
          this.end = registry.substring(end + 1)
          registry = registry.substring(0, end)
          this.altRegistry = registry
        }
      }

      return d
  }

  public registryLegal(): string {
    return GLOBALS.registry.legal || ''
  }

  public gotoRegistry(r: string): boolean {

    this.load(r)
    return false
  }

  public showPackageDetails(p: Package): boolean  {

    this._router.navigate(['/package', p.packageName], {skipLocationChange: true})
    return false // called via href click, need to return false to stop reload
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

    this.addPackageClicked = true
  }

  public addPackageCompleted(success: boolean): void {
    this.addPackageClicked = false
  }
}
