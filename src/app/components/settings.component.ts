import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms'

import { MatDialog } from '@angular/material/dialog'
import { MatTable } from '@angular/material/table'
import { MatSnackBar } from '@angular/material/snack-bar'

import { faTrashAlt, faPlusSquare, faGlobeAfrica, faBuilding, faCube, faPen, faWrench } from '@fortawesome/free-solid-svg-icons'

import { Credentials } from '../models/Credentials'
import { NewPackageNotification } from '../models/new-package-notification'
import { SettingsService } from '../services/settings.service'
import { NotificationsService } from '../services/notifications-service'

import { ListPackagesRegistriesComponent } from './list-package-registries.component'

import { GLOBALS } from '../globals'

@Component({
  selector: 'app-settings',
  templateUrl: './templates/settings.component.html'
})
export class SettingsComponent implements OnInit {

  public faTrashAlt = faTrashAlt
  public faPlusSquare = faPlusSquare
  public faGlobeAfrica = faGlobeAfrica
  public faBuilding = faBuilding
  public faCube = faCube
  public faPen = faPen
  public faWrench = faWrench

  public currentUser: string = ''
  public credentials: Credentials[] = []
  public form: UntypedFormGroup
  public gitUrlCtrl: UntypedFormControl
  public gitUserCtrl: UntypedFormControl
  public gitTokenCtrl: UntypedFormControl
  public emailAddressCtrl: UntypedFormControl

  public notifications: NewPackageNotification[] = []

  displayedColumnsForCredentials: string[] = ['source', 'user', 'token', 'remove']

  @ViewChild('credentialsTable', {read: MatTable})
  public table: MatTable<Credentials>

  // tslint:disable-next-line:variable-name max-line-length
  public constructor(private _router: Router, private _formBuilder: UntypedFormBuilder, private _dialog: MatDialog, private _snackBar: MatSnackBar,
  // tslint:disable-next-line:variable-name
                     private _notificationService: NotificationsService,
                     // tslint:disable-next-line:variable-name
                     private _settings: SettingsService) {

    this.gitUrlCtrl = new UntypedFormControl()
    this.gitUserCtrl = new UntypedFormControl()
    this.gitTokenCtrl = new UntypedFormControl()
    this.emailAddressCtrl = new UntypedFormControl()

    this.form = this._formBuilder.group({
      gitUrlCtrl: this.gitUrlCtrl,
      gitUserCtrl: this.gitUserCtrl,
      gitTokenCtrl: this.gitTokenCtrl,
      emailAddressCtrl: this.emailAddressCtrl
    })

    this._settings.currentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user
        this.load()
      } else {
        this._router.navigate(['packages'])
      }
    })
  }

  public ngOnInit(): void {

    /*this.form.valueChanges.subscribe((ctrl) => {
      if (this.emailAddressCtrl.dirty) {
        this.defaultEmailDidChange()
        this.emailAddressCtrl.markAsPristine()
      }
    })*/
  }

  public defaultEmailDidChange(): void {

    GLOBALS.settings.email = this.emailAddressCtrl.value
    this._notificationService.updateDefaultEmail(GLOBALS.settings.email).subscribe((success) => {
      if (!success) {
        this._snackBar.open('No can do!', 'Sorry', {
          duration: 2000,
        })
      }
    })
  }

  public editRow(element: any): void {
    element.isEditable = true
    this.gitUrlCtrl.setValue(element.source, {emitEvent: true})
    this.gitUserCtrl.setValue(element.user, {emitEvent: true})
    this.gitTokenCtrl.setValue(null, {emitEvent: true})

    this.credentials.forEach((c) => {

      if (c !== element) {
        c.isEditable = false
      }
    })
  }

  public isEditableGitRowValid(): boolean {
    return this.gitUrlCtrl.value != null && this.gitUserCtrl.value != null && this.gitTokenCtrl.value != null
  }

  public saveChanges(element: Credentials): void {

    this._settings.setDeveloperCredentials(this.gitUrlCtrl.value, this.gitUserCtrl.value, this.gitTokenCtrl.value).subscribe((success) => {
      if (success) {

        element.source = this.gitUrlCtrl.value
        element.user = this.gitUserCtrl.value
        element.token = this.gitTokenCtrl.value
        element.isEditable = false

        this.gitUrlCtrl.setValue(null, {emitEvent: false})
        this.gitUserCtrl.setValue(null, {emitEvent: false})
        this.gitTokenCtrl.setValue(null, {emitEvent: false})

        if (element.source === '*') {
          // tslint:disable-next-line:max-line-length
          this.credentials[(this.credentials.length - 1)].isEditable = true // now we have finished editing default row, make last row editable
        } else {
          this.addCredentialsRow()
        }
      } else {
        this._snackBar.open('owah, failed to add credentials', 'Sorry', {
          duration: 2000,
        })
      }
    })
  }

  public cancelEdit(element: Credentials): void {
    element.isEditable = false

    if (element.token == null) {
      this.removeCredentialsRow(element)
    }
  }

  public addCredentialsRow(): void {

    const p: Credentials = new Credentials()
    p.isEditable = true

    this.credentials.push(p)
    this.table.renderRows()
  }

  public removeCredentialsRow(element: Credentials): void {

    let found = -1

    for (let i = 0; i < this.credentials.length; i++) {

      if (this.credentials[i] === element) {
        found = i
      }
    }

    if (found !== -1) {
      this.form.removeControl('key:' + found)
      this.form.removeControl('type:' + found)
      this.form.removeControl('value:' + found)

      this.credentials.splice(found, 1)
      this.table.renderRows()

      this._settings.removeDeveloperCredentials(element.source, element.user).subscribe((success) => {

        if (!success) {
          this._snackBar.open('ach, deletion failed', 'Sorry', {
            duration: 2000,
          })
        }
      })
    }
  }

  public saveEmail(): void {
    this.defaultEmailDidChange()
  }

  public showToken(c: Credentials): string {
    if (c.token) {
      return '**********'
    } else {
      return ''
    }
  }

  public addNotification(): void {

    const dialogRef = this._dialog.open(ListPackagesRegistriesComponent, {
        width: '50%',
        height: '350px',
        data: {
          ref: 'Choose the registry for which you want to receive notifications ?',
          omitList: this.omitList()
        }
      })

    dialogRef.afterClosed().subscribe(result => {

      if (result.package) {
        // tslint:disable-next-line:max-line-length
        this._notificationService.addPackageNotification(result.package, GLOBALS.user, this.emailAddressCtrl.value, GLOBALS.registry.name).subscribe((response) => {
          if (response) {
            this.notifications.push(response)
          } else {
              this._snackBar.open('Flub, failed to create new notification', 'Sorry', {
                duration: 2000,
              })
          }
        })
      } else if (result.registry) {
        // tslint:disable-next-line:max-line-length
        this._notificationService.addRegistryNotification(result.registry, GLOBALS.user, this.emailAddressCtrl.value).subscribe((response) => {
          if (response) {
            this.notifications.push(response)
          } else {
            this._snackBar.open('Ouch, couldn\'t register notification', 'Sorry', {
              duration: 2000,
            })
          }
        })
      }
    })
  }

  public removeNotification(element: NewPackageNotification): void {

    this._notificationService.removeNotification(element.name, element.isPackage, element.registry).subscribe((success) => {
      if (success) {
        let found = -1
        for (let i = 0; i < this.notifications.length; i++) {
          if (this.notifications[i].name === element.name) {
            found = i
            break
          }
        }

        if (found !== -1) {
          this.notifications.splice(found, 1)
        }
      } else {
        this._snackBar.open('Wow, unable to remove notification', 'Sorry', {
          duration: 2000,
        })
      }
    })
  }

  public notificationType(n: NewPackageNotification): string {
    if (n.isPackage) {
      return 'dlt-icon-package lg-icon'
    } else {
      return 'dlt-icon-globe lg-icon'
    }
  }

  public backgroundStyleForNotification(n: NewPackageNotification): any {

    if (n.isPackage) {
      return {'background-color': 'orange'}
    } else {
      return {}
    }
  }

  private omitList(): string[] {

    const omitlist: string[] = []

    if (this.notifications) {
      this.notifications.forEach((n) => {
        omitlist.push(n.name)
      })
    }

    return omitlist
  }

  private load(): void {

    this._settings.developerCredentials().subscribe((r) => {

      this.addDefaultIfNotPresent(r)
      /*const editableCredentials = new Credentials()
      editableCredentials.isEditable = true
      r.push(editableCredentials)*/

      this.credentials = r
    })

    this._notificationService.defaultEmail().subscribe((s) => {
      this.emailAddressCtrl.setValue(s.email, {emitEvent: false})
    })

    this._notificationService.notifications().subscribe((n) => {
      this.notifications = n
    })
  }

  private addDefaultIfNotPresent(creds: Credentials[]): Credentials[] {

    let found = false

    for (const c of creds) {
      if (c.source === '*') {
        found = true
        break
      }
    }

    if (!found) {
      const c = new Credentials()
      c.source = '*'
      creds.unshift(c)
    }

    return creds
  }
}
