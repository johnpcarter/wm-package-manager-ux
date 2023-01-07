import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'

import { faThumbsUp, faThumbsDown, faTimes, faClock, faUser, faEnvelope, faStamp, faSignature, faCheckCircle, faQuestionCircle,
                faArrowCircleDown, faExclamationTriangle, faBox } from '@fortawesome/free-solid-svg-icons'
import { faGitAlt } from '@fortawesome/free-brands-svg-icons'

import { Tag } from '../models/Tag'
import { Package } from '../models/Package'

import { PackagesServices } from '../services/packages.service'

import { GLOBALS } from '../globals'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-trust-tag',
  templateUrl: './templates/create-access-token.component.html'
})
export class CreateAccessTokenComponent implements OnInit {

  public label: string
  public numOfDays: number

  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name max-line-length
  constructor(dialogRef: MatDialogRef<any>) {

    this._dialogRef = dialogRef
  }

  ngOnInit(): void {
  }

  public confirm(): void {
    this._dialogRef.close({label: this.label, numOfDays: this.numOfDays})

  }
  public onNoClick(ref?: any): void {
    this._dialogRef.close()
  }
}
