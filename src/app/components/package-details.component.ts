import {Component, Inject, OnInit} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog'
import {MatSnackBar} from '@angular/material/snack-bar'

import { faTimes, faUniversalAccess, faTags, faObjectGroup, faCheckCircle, faEraser, faKey, faBinoculars, faStar, faLongArrowAltDown,
  faClock, faUsers, faLockOpen, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { faGitAlt, faGithub } from '@fortawesome/free-brands-svg-icons'

import { Package, TagSummary } from '../models/Package'
import { PackagesServices } from '../services/packages.service'
import { ThemePalette } from '@angular/material/core'
import { TagInfoComponent } from './tag-info.component'
import { AddUserComponent } from './add-user.component'
import { RemoveConfirmationComponent } from './remove-confirmation.component'

import { GLOBALS } from '../globals'

@Component({
  selector: 'app-package-details',
  templateUrl: './templates/packages-details.component.html'
})
export class PackageDetailsComponent implements OnInit {

  public faTimes = faTimes
  public faUniversalAccess = faUniversalAccess
  public faTags = faTags
  public faGitAlt = faGitAlt
  public faObjectGroup = faObjectGroup
  public faCheckCircle = faCheckCircle
  public faEraser = faEraser
  public faKey = faKey
  public faGithub = faGithub
  public faBinoculars = faBinoculars
  public faStar = faStar
  public faLongArrowAltDown = faLongArrowAltDown
  public faClock = faClock
  public faUsers = faUsers
  public faLockOpen = faLockOpen
  public faMinusCircle = faMinusCircle
  public faPlusCircle = faPlusCircle

  public package: Package

  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name max-line-length
  constructor(dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private _dialog: MatDialog,  private _snackbar: MatSnackBar, private _packagesServices: PackagesServices) {
    this._dialogRef = dialogRef
    this.package = data.package
  }

  ngOnInit(): void {

    this._packagesServices.package(this.package.name, GLOBALS.registry.name).subscribe((p) => {

      if (p) {
        this.package = p
      }
    })
  }

  public onNoClick(): void {
    this._dialogRef.close()
  }

  public authType(): string {
    if (this.package.private) {
      return 'Private'
    } else {
      return 'Public'
    }
  }

  public count(value: string): string {
    if (value) {
      return value
    }  else {
      return '0'
    }
  }

  public colorForTag(tag: TagSummary): ThemePalette {
    if (tag && tag.signature) {
      return 'primary'
    } else {
      return 'accent'
    }
  }


  public isAdministrator(): boolean {
    return GLOBALS.isAdministrator()
  }

  public showTagInfo(t: string, w?: string, bye?: string, s?: string): void {

    if (this.isAdministrator()) {
      const dialogRef = this._dialog.open(TagInfoComponent, {
        width: '60%',
        height: '550px',
        data: {
          package: this.package,
          tag: t,
          when: w,
          by: bye,
          signature: s
        },
      })

      dialogRef.afterClosed().subscribe(result => {

        if (!result) {
          return
        }

        if (result.added) {
          const trustedTag = new TagSummary()
          trustedTag.tag = t
          trustedTag.by = GLOBALS.user
          this.package.trustedTags.push(trustedTag)

          let found = -1
          for (let i = 0; i < this.package.availableTags.length; i++) {
            if (this.package.availableTags[i] === t) {
              found = i
              break
            }
          }

          if (found !== -1) {
            this.package.availableTags.splice(found, 1)
            this.package.availableTags = [...this.package.availableTags]
          }
        } else if (result.removed) {
          if (this.package.availableTags == null) {
            this.package.availableTags = []
          }

          this.package.availableTags.push(t)

          let found = -1
          for (let i = 0; i < this.package.trustedTags.length; i++) {
            if (this.package.trustedTags[i].tag === t) {
              found = i
              break
            }
          }

          if (found !== -1) {
            this.package.trustedTags.splice(found, 1)
            this.package.trustedTags = [...this.package.trustedTags]
          }
        }
      })

    } else {
      // do nothing

    }
  }

  public unregisterPackage(): void {

    if (this.isAdministrator()) {
      const dialogRef = this._dialog.open(RemoveConfirmationComponent, {
        width: '50%',
        height: '250px',
        data: {
          ref: this.package.name
        },
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result.confirm) {
          this._packagesServices.removePackage(this.package.name, GLOBALS.registry.name).subscribe((success) => {
            if (success) {
              this._dialogRef.close()
            }
          })
        }
      })

    } else {
      // do nothing

    }
  }

  public clickedUser(ref: string): void {

    if (ref === 'everybody') {
      // add new user
      this.addUser()
    } else {
      this.removeUser(ref)
    }
  }

  public users(): string[] {

    if (this.package.users) {
      return this.package.users
    } else {
      return ['everybody']
    }
  }

  public addUser(): void {

    if (this.isAdministrator()) {
      const dialogRef = this._dialog.open(AddUserComponent, {
        width: '50%',
        height: '180px',
        data: {
          package: this.package
        }
      })

      dialogRef.afterClosed().subscribe(result => {

        if (!this.removeUser('everybody')) {
          this._packagesServices.updateUsers(this.package.name, this.package.users, GLOBALS.registry.name).subscribe((success) => {
            if (!success) {
              if (!success) {
                this._snackbar.open('update failed', 'Dismiss', {
                  duration: 2000,
                })
              }
            }
          })
        }
      })

    } else {
      // do nothing

    }
  }

  public removeUser(user: string): boolean {

    let found = -1

    if (this.isAdministrator()) {
      for (let i = 0; i < this.package.users.length; i++) {
        if (this.package.users[i] === user) {
          found = i
          break
        }
      }

      if (found !== -1) {
        this.package.users.splice(found, 1)

        if (this.package.users.length === 0) {
          // add back everybody, otherwise package will be invisible

          this.package.users.push('everybody')
        }
        this._packagesServices.updateUsers(this.package.name, this.package.users, GLOBALS.registry.name).subscribe((success) => {
            if (success) {
              this.package.users = [...this.package.users]
            } else {
              if (!success) {
                this._snackbar.open('update failed', 'Dismiss', {
                  duration: 2000,
                })
              }
            }
        })
      }
    }

    return found !== -1
  }
}
