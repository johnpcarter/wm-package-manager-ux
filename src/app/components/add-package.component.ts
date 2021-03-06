import {Component, Inject, OnInit} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'

import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'

import { Package } from '../models/Package'
import { Registry } from '../models/Registry'

import { PackagesServices } from '../services/packages.service'

import { GLOBALS } from '../globals'

@Component({
  selector: 'app-add-registry',
  templateUrl: './templates/add-package.component.html'
})
export class AddPackageComponent implements OnInit {

  public faPlus = faPlus
  public faTimes = faTimes

  public registry: Registry

  public form: FormGroup
  public nameCtrl: FormControl
  public descriptionCtrl: FormControl
  public categoryCtrl: FormControl
  public homePageCtrl: FormControl
  public sourceCtrl: FormControl
  public sourcePathCtrl: FormControl
  public requiresAuthenticationCtrl: FormControl
  public privateCtrl: FormControl

  public failed: boolean = false

  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name max-line-length
  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data, dialogRef: MatDialogRef<any>, private _packagesService: PackagesServices) {

    this._dialogRef = dialogRef

    this.registry = data.registry

    this.nameCtrl = new FormControl('', Validators.required)
    this.descriptionCtrl = new FormControl('', Validators.required)
    this.categoryCtrl = new FormControl('', Validators.required)
    this.sourceCtrl = new FormControl('', Validators.required)
    this.homePageCtrl = new FormControl()
    this.sourcePathCtrl = new FormControl()
    this.requiresAuthenticationCtrl = new FormControl()
    this.privateCtrl = new FormControl()

    this.form = this.formBuilder.group({
      name: this.nameCtrl,
      description: this.descriptionCtrl,
      category: this.categoryCtrl,
      homePage: this.homePageCtrl,
      source: this.sourceCtrl,
      sourcePath: this.sourcePathCtrl,
      requiresAuthentication: this.requiresAuthenticationCtrl,
      private: this.privateCtrl
    })
  }

  ngOnInit(): void {
  }

  public onNoClick(): void {
    this._dialogRef.close()
  }

  public submit(): void {

    const p = new Package()
    p.packageName = this.nameCtrl.value
    p.description = this.descriptionCtrl.value
    p.category = this.categoryCtrl.value
    p.homePage = this.homePageCtrl.value
    p.sourceUrl = this.sourceCtrl.value
    p.sourcePath = this.sourcePathCtrl.value
    p.sourceIsPrivate = this.requiresAuthenticationCtrl.value

    this._packagesService.createPackage(p, this.registry.name).subscribe((success) => {
      if (success) {
        this._dialogRef.close()
      } else {
        this.failed = true
      }
    })
  }

  public toggleRequireAuth(): void {
    if (this.requiresAuthenticationCtrl.value) {
      this.requiresAuthenticationCtrl.setValue(false, {emitEvent: false})
    } else {
      this.requiresAuthenticationCtrl.setValue(true, {emitEvent: false})
    }
  }

  public user(): string {
    return GLOBALS.user
  }
}
