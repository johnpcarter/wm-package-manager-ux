import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { faTimes, faUser } from '@fortawesome/free-solid-svg-icons'
import { PackagesServices } from '../services/packages.service'
import { Package } from '../models/Package'
import { GLOBALS } from '../globals'

@Component({
  selector: 'app-add-user',
  templateUrl: './templates/add-user.component.html'
})
export class AddUserComponent implements OnInit {

  public faUser = faUser
  public faTimes = faTimes

  public title: string = 'Add user'
  public placeholder: string = ''
  public package: Package
  public users: string[]

  public ref: string = null

  // tslint:disable-next-line:variable-name
  private _registry: string
  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name
  constructor(dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private _packagesServices: PackagesServices) {
    this._dialogRef = dialogRef

    if (data) {
      if (data.title != null) {
        this.title = data.title
      }

      if (data.placeholder != null) {
        this.placeholder = data.placeholder
      }

      this.package = data.package
      this.users = data.users
    }
  }

  ngOnInit(): void {
  }

  public isInvalid(): boolean {
    // tslint:disable-next-line:max-line-length
    return this.ref === null || this.ref.length === 0 || this.ref === 'everybody' || (this.users != null && this.users.indexOf(this.ref) !== -1)
  }

  public add(): void {

    if (this.users != null) {

      if (this.ref !== 'everybody') {
        if (this.users) {
          this.users.push(this.ref)
        } else {
          this.users = [this.ref]
        }

        this._dialogRef.close({ok: true})
      }
    } else {
      this._dialogRef.close({ref: this.ref})
    }
  }

  public onNoClick(): void {
    this._dialogRef.close({ok: false})
  }

  public isAdministrator(): boolean {
    return GLOBALS.isAdministrator()
  }
}
