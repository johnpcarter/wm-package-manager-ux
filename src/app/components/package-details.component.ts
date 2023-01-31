import {Component, OnInit} from '@angular/core';

import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

import {
  faBell,
  faBellSlash,
  faBinoculars,
  faClock,
  faEraser,
  faEye,
  faEyeSlash,
  faFolder,
  faInfoCircle,
  faKey,
  faLongArrowAltDown,
  faLongArrowAltUp,
  faRocket,
  faStar,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import {faGit, faGitAlt} from '@fortawesome/free-brands-svg-icons';
import {MarkdownService} from 'ngx-markdown';

import {Package, PackageStat, TagSummary} from '../models/Package';
import {GitInfo} from '../models/GitInfo';

import {PackagesServices, VoteResult} from '../services/packages.service';
import {NotificationsService} from '../services/notifications-service';

import {TagInfoComponent} from './tag-info.component';
import {AddUserComponent} from './add-user.component';
import {RemoveConfirmationComponent} from './remove-confirmation.component';

import {ListRegistriesComponent} from './list-registries.component';
import {ManageUsersComponent} from './manage-users.component';

import {GLOBALS} from '../globals';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-package-details',
  templateUrl: './templates/packages-details.component.html'
})
export class PackageDetailsComponent implements OnInit {

  public faBellSlash = faBellSlash
  public faBell = faBell
  public faEye = faEye
  public faClock = faClock
  public faEyeSlash = faEyeSlash
  public faInfoCircle = faInfoCircle
  public faGit = faGit
  public faGitAlt = faGitAlt
  public faLongArrowAltDown = faLongArrowAltDown
  public faLongArrowAltUp = faLongArrowAltUp
  public faStar = faStar
  public faBinoculars = faBinoculars
  public faFolder = faFolder
  public faUsers = faUsers
  public faEraser = faEraser
  public faRocket = faRocket
  public faKey = faKey

  public packageName: string
  public package: Package
  public users: string[] = []
  public gitInfo: GitInfo
  public alertMe: boolean

  public markdown: string = ''
  public noReadmeAvailable: string =
`### No README.md found in the package repository
*Tell the developer to provide one!*
`

  // put the text completely on the left to avoid extra white spaces
  public markdownText: string = 'loading.....'

  public downloadsStats: PackageStat[] = []
  public maxDownloadValue: number = 0

  public selectedVersion: string = null
  public versions: TagSummary[] = []
  public trust: string = null

  // tslint:disable-next-line:variable-name
  private _didLoad: boolean = false

  // tslint:disable-next-line:variable-name
  constructor(private _router: Router, private route: ActivatedRoute, private mdService: MarkdownService, private _snackbar: MatSnackBar,
              // tslint:disable-next-line:variable-name max-line-length
              private _packagesServices: PackagesServices, private _notificationsService: NotificationsService, private _dialog: MatDialog) {

      if (GLOBALS.registry.trustLevel === 0) {
        this.versions = [new TagSummary('main')]
      }

      this.route.params.subscribe((params: Params) => {
        this.packageName = (params as any).packageName

        this._packagesServices.package(this.packageName, GLOBALS.registry.name).subscribe((p) => {

          if (p) {
            this.package = p
            this.alertMe = this.package.alertEmail != null
            this._didLoad = true

            this._packagesServices.getPackageReadme(this.package.packageName, null, GLOBALS.registry.name).subscribe((readme) => {
              if (readme) {
                this.markdown = this.mdService.parse(readme)
              } else {
                this.markdown = this.noReadmeAvailable
              }
            })

            this._packagesServices.gitInfo(this.package.packageName, GLOBALS.registry.name).subscribe((gitInfo) => {
              this.gitInfo = gitInfo
            })

            this._packagesServices.tags(this.package.packageName, GLOBALS.registry.name).subscribe((tags) => {

              if (tags && tags.length > 0) {
                tags.forEach(t => {
                  this.versions.push(t)
                })

                this.selectedVersion = this.versions[this.versions.length - 1].tag
                this.trust = this.versions[this.versions.length - 1].trust
              }
            })
          }
        })

        this._packagesServices.history(this.packageName, GLOBALS.registry.name).subscribe((h) => {

          h.forEach((v) => {
            if (v.value > this.maxDownloadValue) {
              this.maxDownloadValue = v.value
            }

            this.downloadsStats.push(new PackageStat(v.label, v.value))
          })
        })

        if (GLOBALS.isAdministrator()) {
          this._packagesServices.users(this.packageName, GLOBALS.registry.name).subscribe((u) => {

            if (u) {
              this.users = u
            } else {
              this.users.push('everybody')
              this.saveUsers()
            }
          })
        }
      })
  }

  ngOnInit(): void {

    this.markdown = this.mdService.parse(this.markdownText)
  }

  public goBack(): boolean {
    this._router.navigate([''], {
      queryParams: { registry: GLOBALS.registry.name },
      queryParamsHandling: 'merge' })
    return false
  }

  public onLoad(data: any): void {
    console.log(data)
  }

  public onError(data: any): void {
    console.log(data)
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

  public colorForTag(tag: TagSummary): any {
    if (tag && tag.signature) {
      return {'background-color': 'blue'}
    } else {
      return {'background-color': 'red'}
    }
  }

  public isTrustedRegistry(): boolean {
   return /*GLOBALS.registry.type === RegistryType.private ||*/ GLOBALS.registry.trustLevel > 0
  }

  public isAdministrator(): boolean {
    return this._didLoad && GLOBALS.isAdministrator()
  }

  public selectVersion(): void {

    let t: TagSummary = null

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.versions.length; i++) {
      if (this.versions[i].tag === this.selectedVersion) {
        t = this.versions[i]
        break
      }
    }

    if (t) {
      this.trust = t.trust
    }

    this._packagesServices.getPackageReadme(this.packageName, this.selectedVersion, GLOBALS.registry.name).subscribe((readme) => {
      if (readme) {
        this.markdown = this.mdService.parse(readme)
      }
    })
  }

  public showTagInfo(): void {

    let t: TagSummary = null

    for (let i = 0; i < this.versions.length; i++) {
      if (this.versions[i].tag === this.selectedVersion) {
        t = this.versions[i]
        break
      }
    }

    if (t) {
      const dialogRef = this._dialog.open(TagInfoComponent, {
        width: '60%',
        height: '650px',
        data: {
          package: this.package,
          tag: t
        },
      })

      dialogRef.afterClosed().subscribe(result => {

        if (!result) {
          return
        }

        if (result.added) {
          this.trust = 'TRUSTED'
          this.package.trustedTags.push(t)
        } else if (result.removed) {
          // removed

          let found = -1
          for (let i = 0; i < this.package.trustedTags.length; i++) {
            if (this.package.trustedTags[i].tag === t.tag) {
              found = i
              break
            }
          }

          if (found !== -1) {
            this.trust = 'NOT_TRUSTED'
            this.package.trustedTags.splice(found, 1)
          }
        }
      })
    }
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
              this._router.navigate(['/packages'])
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
      if (this.users.length > 10) {
        return this.users.slice(0, 10)
      } else {
        return this.users
      }
    } else {
      return []
    }
  }

  public remainderUsers(): number {
    if (this.users.length > 10) {
      return this.users.length - 10
    } else {
      return 0
    }
  }

  public manageUsers(): void {

    if (this.isAdministrator()) {
      const dialogRef = this._dialog.open(ManageUsersComponent, {
        width: '350px',
        height: '700px',
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
        height: '210px',
        data: {
          package: this.package,
          users: this.users
        }
      })

      dialogRef.afterClosed().subscribe(result => {

        if (result && result.ok) {
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

        if (result && result.registry) {
          this._packagesServices.migratePackage(this.package.packageName, result.registry, GLOBALS.registry.name).subscribe((success) => {
            if (success) {
              this._router.navigate(['/packages'])
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
      return {color: 'black'}
    } else {
      return {color: 'lightgray'}
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
      return {color: 'black'}
    } else {
      return {color: 'lightgray'}
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

  public upVote(): void {
    if (this.isConnected()) {
      this._packagesServices.upVote(this.packageName, GLOBALS.registry.name).subscribe((result) => {
        if (result === VoteResult.success) {
          this.package.upVotes += 1
        } else if (result === VoteResult.canceled) {
          this.package.downVotes -= 1
          this._snackbar.open('Your previous down vote has been canceled', 'ok', {
            duration: 2000,
          })
        } else {
          this._snackbar.open('You can only vote once, either thumbs up or thumbs down', 'Sorry', {
            duration: 2000,
          })
        }
      })
    } else {
      this._snackbar.open('To vote, you need to login', 'Ok', {
        duration: 2000,
      })
    }
  }

  public downVote(): void {
    if (this.isConnected()) {
      if (this.isConnected()) {
        this._packagesServices.downVote(this.packageName, GLOBALS.registry.name).subscribe((result) => {
          if (result === VoteResult.success) {
            this.package.downVotes += 1
          } else if (result === VoteResult.canceled) {
            this.package.upVotes -= 1
            this._snackbar.open('Your previous up vote has been canceled', 'ok', {
              duration: 2000,
            })
          } else {
            this._snackbar.open('You can only vote once, either thumbs up or thumbs down', 'Sorry', {
              duration: 2000,
            })
          }
        })
      }
    } else {
      this._snackbar.open('To vote, you need to login', 'Ok', {
        duration: 2000,
      })
    }
  }

  public selectedVersionStyle(): any {

    if (this.trust !== 'TRUSTED' && this.isTrustedRegistry()) {
      return {'border-bottom': '3px solid red'}
    } else {
      return {}
    }
  }

  public trustLabel(): string {

    if (this.trust === 'NOT_TRUSTED') {
      return 'Unverified'
    } else if (this.trust === 'TRUSTED_WITH_VALIDATION_ERRORS') {
      return 'Signed w/errors'
    } else {
      return 'No signature'
    }
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
      // tslint:disable-next-line:prefer-for-of
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
    this._notificationsService.addPackageNotification(this.package.packageName, GLOBALS.user, GLOBALS.settings.email, GLOBALS.registry.name)
      .subscribe((success) => {
      if (!success) {
        this.alertMe = !this.alertMe
        this._snackbar.open('Couldn\'t add notification', 'Sorry', {
          duration: 2000,
        })
      }
    })
  }
}
