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

  public package: Package

  public user: string

  // tslint:disable-next-line:variable-name
  private _registry: string
  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name
  constructor(dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private _packagesServices: PackagesServices) {
    this._dialogRef = dialogRef
    this.package = data.package
  }

  ngOnInit(): void {
  }

  public addUser(): void {

    this.package.users.push(this.user)
    this._dialogRef.close()
  }

  public onNoClick(): void {
    this._dialogRef.close()
  }

  public isAdministrator(): boolean {
    return GLOBALS.isAdministrator()
  }
}
