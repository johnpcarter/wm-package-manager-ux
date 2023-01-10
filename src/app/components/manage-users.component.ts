import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { faTimes, faUser, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { MatSnackBar } from '@angular/material/snack-bar'

import { PackagesServices } from '../services/packages.service'
import { Package } from '../models/Package'
import { GLOBALS } from '../globals'

@Component({
  selector: 'app-manage-users',
  templateUrl: './templates/manage-users.component.html',
  styles: [' /deep/ .mat-list-item-content { justify-content: space-between }']
})
export class ManageUsersComponent implements OnInit {

  public faUser = faUser
  public faTimes = faTimes
  public faTrashAlt = faTrashAlt

  public package: Package
  public users: string[]

  public user: string

  public syncAll: boolean = false
  public syncUser: string = null

  // tslint:disable-next-line:variable-name
  private _registry: string
  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name
  constructor(dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private _packagesServices: PackagesServices,
              // tslint:disable-next-line:variable-name
              private _snackbar: MatSnackBar) {

    this._dialogRef = dialogRef
    this.package = data.package
    this.users = data.users
  }

  ngOnInit(): void {
  }

  public styleForUserLabel(user: string): any {

    if (user === 'everybody') {
      return {color: 'lightgray'}
    } else {
      return {}
    }
  }

  public truncate(str: string): string {
    if (str.length > 20) {
      return str.substring(0, 20) + '...'
    } else {
      return str
    }
  }

  public syncAllUsers(): void {

    this.syncAll = true

    this.users.forEach((u) => {
      this.syncDeployKey(u)
    })
  }

  public syncDeployKey(user: string): void {

    this.syncUser = user

    this._packagesServices.syncUser(this.package.packageName, user, GLOBALS.registry.name).subscribe((success) => {

      if (this.syncAll && this.syncUser === this.users[this.users.length - 1]) {
        this.syncAll = false
      }

      this.syncUser = null

      if (success) {
        this.package.sourceHasTokenForEverybody = true
        this._snackbar.open('deploy token synced with git repository', 'Hoorah', {
          duration: 2000,
        })
      } else {
        this._snackbar.open('Sync failed, probably already done!', 'Sorry', {
          duration: 2000,
        })
      }
    })
  }

  public addUser(): void {

    if (this.user !== 'everybody') {
      if (this.users) {
        this.users.push(this.user)
      } else {
        this.users = [this.user]
      }

      if (!this.removeUser('everybody')) {
        this.saveUsers()
      }
    }
  }

  public removeUser(user: string): boolean {

    let found: number = -1

    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] === user) {
        found = i
        break
      }
    }

    if (found !== -1) {
      this.users.splice(found, 1)

      if (this.users.length === 0) {
        this.users.push('everybody')
      }

      this.saveUsers()
    }

    return found !== -1
  }

  private saveUsers(): void {

    this._packagesServices.updateUsers(this.package.packageName, this.users, GLOBALS.registry.name).subscribe((success) => {
      if (success) {
        if (!this.package.isVisible && this.users.length > 0) {
          this._packagesServices.setVisibility(this.package.packageName, true, GLOBALS.registry.name).subscribe((s) => {
            if (!s) {
              this._snackbar.open('failed to make package visible setting users', 'Dismiss', {
                duration: 2000,
              })
            }
          })
        }
      } else {
        this._snackbar.open('update failed', 'Dismiss', {
          duration: 2000,
        })
      }
    })
  }

  public close(): void {
    this._dialogRef.close({save: true})
  }

  public onNoClick(): void {
    this._dialogRef.close({save: false})
  }

  public isAdministrator(): boolean {
    return GLOBALS.isAdministrator()
  }
}
