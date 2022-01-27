import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

import { MatDialog } from '@angular/material/dialog'
import { MatTable } from '@angular/material/table'
import { MatSnackBar } from '@angular/material/snack-bar'

import { faTrashAlt, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

import { Credentials } from '../models/Credentials'
import { SettingsService } from '../services/settings.service'

@Component({
  selector: 'app-settings',
  templateUrl: './templates/settings.component.html'
})
export class SettingsComponent implements OnInit {

  public faTrashAlt = faTrashAlt
  public faPlusSquare = faPlusSquare

  public credentials: Credentials[] = []
  public form: FormGroup

  displayedColumns: string[] = ['source', 'user', 'token', 'remove']

  @ViewChild('credentialsTable', {read: MatTable})
  public table: MatTable<Credentials>

  // tslint:disable-next-line:variable-name
  public constructor(private _formBuilder: FormBuilder, private _dialog: MatDialog,  private _snackBar: MatSnackBar, private _settings: SettingsService) {

    this.form = this._formBuilder.group({})
  }

  public ngOnInit(): void {

    this._settings.developerCredentials().subscribe((r) => {
      this.credentials = r
      this.addDefaultIfNotPresent()
    })
  }

  public controlForPanelElement(key: string, element: Credentials, value?: string): FormControl {

    let ctrl: FormControl = null

    const name: string = key + ':' + this.indexOfElement(element) // element.position

    if (this.form.controls[name]) {
      ctrl = (this.form.controls[name] as FormControl)
    } else {
      ctrl = new FormControl(value)
      this.form.addControl(name, ctrl)
    }

    return ctrl
  }

  public updateElementWithControlValue(key: string, element: Credentials): void {

    element[key] = this.controlForPanelElement(key, element).value

    if (element.source && element.user && element.token) {
      this._settings.setDeveloperCredentials(element.source, element.user, element.token).subscribe((success) => {

        if (!success) {
          this._snackBar.open('update failed', 'Dismiss', {
            duration: 2000,
          })
        }
      })
    }

  }

  public addRow(): void {

    const p: Credentials = new Credentials()

    this.credentials.push(p)
    this.table.renderRows()
  }

  public removeRow(element: Credentials): void {

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
          this._snackBar.open('deletion failed', 'Dismiss', {
            duration: 2000,
          })
        }
      })
    }
  }

  private addDefaultIfNotPresent(): void {

    let found = false

    for (const c of this.credentials) {
      if (c.source === '*') {
        found = true
        break
      }
    }

    if (!found) {
      const c = new Credentials()
      c.source = '*'
      this.credentials.unshift(c)
    }
  }

  private indexOfElement(element: any): number {

    let found: number = 0

    for (let i = 0; i < this.credentials.length; i++) {

      if (this.credentials[i] === element) {
        found = i
        break
      }
    }

    return found
  }
}
