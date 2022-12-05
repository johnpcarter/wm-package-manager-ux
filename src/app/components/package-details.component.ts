import {Component, Inject, OnInit} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog'

import { ThemePalette } from '@angular/material/core'
import { MatSnackBar } from '@angular/material/snack-bar'

import { faTimes, faUniversalAccess, faTags, faObjectGroup, faInfoCircle, faCheckCircle, faEraser, faKey, faBinoculars, faStar, faLongArrowAltDown,
  faTools, faClock, faUsers, faLockOpen, faPlusCircle, faMinusCircle, faRocket, faBell, faBellSlash, faArrowCircleDown, faFolder,
  faGlobeAfrica, faEye, faEyeSlash, faEllipsisV, faUnlock } from '@fortawesome/free-solid-svg-icons'
import { faGitAlt, faGithub } from '@fortawesome/free-brands-svg-icons'

import { Package, PackageStat, TagSummary } from '../models/Package'
import { GitInfo } from '../models/GitInfo'

import { PackagesServices } from '../services/packages.service'
import { NotificationsService } from '../services/notifications-service'

import { TagInfoComponent } from './tag-info.component'
import { AddUserComponent } from './add-user.component'
import { RemoveConfirmationComponent } from './remove-confirmation.component'

import { ListRegistriesComponent } from './list-registries.component'
import { ManageUsersComponent } from './manage-users.component'

import { GLOBALS } from '../globals'
import { environment } from '../../environments/environment'

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
  public faInfoCircle = faInfoCircle
  public faClock = faClock
  public faUsers = faUsers
  public faLockOpen = faLockOpen
  public faMinusCircle = faMinusCircle
  public faPlusCircle = faPlusCircle
  public faRocket = faRocket
  public faBell = faBell
  public faBellSlash = faBellSlash
  public faArrowCircleDown = faArrowCircleDown
  public faFolder = faFolder
  public faGlobeAfrica = faGlobeAfrica
  public faTools = faTools
  public faEye = faEye
  public faEyeSlash = faEyeSlash
  public faEllipsisV = faEllipsisV
  public faUnlock = faUnlock

  public package: Package
  public users: string[] = []
  public gitInfo: GitInfo
  public availableTags: string[] = []
  public alertMe: boolean

  public downloadsStats: PackageStat[] = []
  public maxDownloadValue: number = 0

  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>
  // tslint:disable-next-line:variable-name
  private _didLoad: boolean = false

  // tslint:disable-next-line:variable-name max-line-length
  constructor(dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private _dialog: MatDialog,
              // tslint:disable-next-line:variable-name max-line-length
              private _snackbar: MatSnackBar, private _packagesServices: PackagesServices, private _notificationsService: NotificationsService) {

      this._dialogRef = dialogRef
      this.package = data.package

      this._packagesServices.package(this.package.packageName, GLOBALS.registry.name).subscribe((p) => {

        if (p) {
          this.package = p
          this.alertMe = this.package.alertEmail != null
          this._didLoad = true

          this._packagesServices.gitInfo(this.package.packageName, GLOBALS.registry.name).subscribe((gitInfo) => {
            this.gitInfo = gitInfo

            if (this.gitInfo.availableTags) {
              this.gitInfo.availableTags.forEach((t) => {
                if (!this.isTrustedTag(t)) {
                  this.availableTags.push(t)
                }
              })
            }
          })
        }
      })

      this._packagesServices.history(this.package.packageName, GLOBALS.registry.name).subscribe((h) => {

        h.forEach((v) => {
          if (v.value > this.maxDownloadValue) {
            this.maxDownloadValue = v.value
          }

          this.downloadsStats.push(new PackageStat(v.label, v.value))
        })
      })

      if (GLOBALS.isAdministrator()) {
        this._packagesServices.users(this.package.packageName, GLOBALS.registry.name).subscribe((u) => {

          if (u) {
            this.users = u
          } else {
            this.users.push('everybody')
            this.saveUsers()
          }
        })
      }
  }

  ngOnInit(): void {
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
    } else {
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
    return this._didLoad && GLOBALS.isAdministrator()
  }

  public haveAvailableTags(): boolean {
    return this.availableTags.length > 0
  }

  public showTagInfo(t: string, w?: string, bye?: string, s?: string): void {

    const dialogRef = this._dialog.open(TagInfoComponent, {
      width: '60%',
      height: '650px',
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
        for (let i = 0; i < this.availableTags.length; i++) {
          if (this.availableTags[i] === t) {
            found = i
            break
          }
        }

        if (found !== -1) {
          this.availableTags.splice(found, 1)
        }
      } else if (result.removed) {
        if (this.availableTags == null) {
          this.availableTags = []
        }

        this.availableTags.push(t)

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
  }

  public unregisterPackage(): void {

    if (this.isAdministrator()) {
      const dialogRef = this._dialog.open(RemoveConfirmationComponent, {
        width: '50%',
        height: '250px',
        data: {
          ref: this.package.packageName
        },
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result.confirm) {
          this._packagesServices.removePackage(this.package.packageName, GLOBALS.registry.name).subscribe((success) => {
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

  public first20Users(): string[] {

    if (this.users) {
      if (this.users.length > 20) {
        return this.users.slice(0, 20)
      } else {
        return this.users
      }
    } else {
      return []
    }
  }

  public remainderUsers(): number {
    if (this.users.length > 20) {
      return this.users.length - 20
    } else {
      return 0
    }
  }

  public manageUsers(): void {

    if (this.isAdministrator()) {
      const dialogRef = this._dialog.open(ManageUsersComponent, {
        width: '350px',
        height: '80%',
        data: {
          package: this.package,
          users: this.users
        }
      })

      dialogRef.afterClosed().subscribe(result => {
        // do nothing
      })
    }
  }

  public addUser(): void {

    if (this.isAdministrator()) {
      const dialogRef = this._dialog.open(AddUserComponent, {
        width: '50%',
        height: '180px',
        data: {
          package: this.package,
          users: this.users
        }
      })

      dialogRef.afterClosed().subscribe(result => {

        if (result.ok) {
          this._removeUser('everybody')
          this.saveUsers()
        }
      })
    }
  }

  public removeUser(user: string): boolean {

    if (this.isAdministrator() && user !== 'everybody') {
      if (this._removeUser(user)) {
        if (this.users.length === 0) {
          this.users.push('everybody')
        }

        this.saveUsers()

        return true
      }
    }

    return false
  }

  private _removeUser(user: string): boolean {

    let found = -1

    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] === user) {
        found = i
        break
      }
    }

    if (found !== -1) {
      this.users.splice(found, 1)
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

  public migratePackage(): void {

    if (this.isAdministrator()) {
      const dialogRef = this._dialog.open(ListRegistriesComponent, {
        width: '50%',
        height: '250px',
        data: {
          omitRegistry: GLOBALS.registry.name,
          ref: 'Migrate package ' + this.package.packageName
        }
      })

      dialogRef.afterClosed().subscribe(result => {

        if (result.registry) {
          this._packagesServices.migratePackage(this.package.packageName, result.registry, GLOBALS.registry.name).subscribe((success) => {
            if (success) {
              this.onNoClick()
            } else {
              this._snackbar.open('update failed', 'Sorry', {
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

  public iconForIsVisibleButton(): any {
    if (this.package.isVisible) {
      return faEye
    } else {
      return faEyeSlash
    }
  }

  public colorForIsVisibleButton(): any {
    if (this.package.isVisible) {
      return {color: 'pink'}
    } else {
      return {color: 'gray'}
    }
  }

  public iconForNotifications(): any {
    if (this.alertMe) {
      return this.faBell
    } else {
      return this.faBellSlash
    }
  }

  public colorForNoticationsButton(): any {
    if (this.alertMe) {
      return {color: 'green'}
    } else {
      return {color: 'gray'}
    }
  }

  public toggleNotifications(): void {

    // this.alertMe = !this.alertMe

    if (this.alertMe) {

      if (GLOBALS.settings.email == null) {

        const dialogRef = this._dialog.open(AddUserComponent, {
          width: '50%',
          height: '180px',
          data: {
            title: 'Enter your email address',
            placeholder: 'bob@somewhere.com'
          }
        })

        dialogRef.afterClosed().subscribe(data => {

          if (data.ref != null) {
            GLOBALS.settings.email = data.ref
            this.addNotification()
            this._notificationsService.updateDefaultEmail(GLOBALS.settings.email).subscribe((success) => {
             // do now't
            })
          } else { // user didn't email, so we can't add notification
            this.alertMe = false
          }
        })
      } else {
        this.addNotification()
      }
    } else {
      this._notificationsService.removeNotification(this.package.packageName, true, GLOBALS.registry.name).subscribe((success) => {
        if (!success) {
          this.alertMe = true
          this._snackbar.open('Failed to remove notification', 'Sorry', {
            duration: 2000,
          })
        }
      })
    }
  }

  public toggleVisibility(): void {

    this._packagesServices.setVisibility(this.package.packageName, this.package.isVisible, GLOBALS.registry.name).subscribe((success) => {

      if (!success) {
        this.package.isVisible = !this.package.isVisible
        this.alertMe = true
        this._snackbar.open('Failed to change visibility', 'Sorry', {
          duration: 2000,
        })
      }
    })
  }

  public isConnected(): boolean {
    return GLOBALS.user !== null
  }

  public isAvailable(): boolean {

    return this.isConnected() && GLOBALS.settings.email != null
  }

  public isAccessible(): boolean {
    return !this.package.sourceIsPrivate || this.package.sourceHasTokenForEverybody
  }

  public syncDeployKey(user: string): void {
    this._packagesServices.syncUser(this.package.packageName, user, GLOBALS.registry.name).subscribe((success) => {
      if (success) {
        this.package.sourceHasTokenForEverybody = true
        this._snackbar.open('deploy token synced with git repository', 'Hoorah', {
          duration: 2000,
        })
      } else {
        this.alertMe = true
        this._snackbar.open('Sync failed, probably already done!', 'Sorry', {
          duration: 2000,
        })
      }
    })
  }

  public setUser(user: string): void {
    this._packagesServices.updateUsers(this.package.packageName, [user], GLOBALS.registry.name).subscribe((success) => {
      if (success) {
        this.package.sourceHasTokenForEverybody = true
      } else {
          this.alertMe = true
          this._snackbar.open('Failed to set user everybody', 'Sorry', {
            duration: 2000,
          })
      }
    })
  }

  public isTrustedTag(tag: string): boolean {

    let found: boolean = false

    // tslint:disable-next-line:prefer-for-of
    if (this.package && this.package.trustedTags) {
      for (let i = 0; i < this.package.trustedTags.length; i++) {
        if (this.package.trustedTags[i].tag === tag) {
          found = true
          break
        }
      }
    }

    return found
  }

  private addNotification(): void {
    // tslint:disable-next-line:max-line-length
    this._notificationsService.addPackageNotification(this.package.packageName, GLOBALS.user, GLOBALS.settings.email, GLOBALS.registry.name).subscribe((success) => {
      if (!success) {
        this.alertMe = !this.alertMe
        this._snackbar.open('Couldn\'t add notification', 'Sorry', {
          duration: 2000,
        })
      }
    })
  }
}
