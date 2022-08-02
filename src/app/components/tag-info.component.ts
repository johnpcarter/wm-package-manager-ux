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
  templateUrl: './templates/tag-info.component.html'
})
export class TagInfoComponent implements OnInit {

  public faThumbsUp = faThumbsUp
  public faBox = faBox
  public faTimes = faTimes
  public faClock = faClock
  public faUser = faUser
  public faGitAlt = faGitAlt
  public faEnvelope = faEnvelope
  public faStamp = faStamp
  public faSignature = faSignature
  public faCheckCircle = faCheckCircle
  public faQuestionCircle = faQuestionCircle
  public faThumbsDown = faThumbsDown
  public faArrowCircleDown = faArrowCircleDown
  public faExclamationTriangle = faExclamationTriangle

  public package: Package
  public tagName: string
  public tagInfo: Tag

  public trusted: string = null
  public haveGitInfo: boolean = false

  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name max-line-length
  constructor(dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private _packagesServices: PackagesServices) {

    this._dialogRef = dialogRef
    this.package = data.package
    this.tagName = data.tag
    this.trusted = data.when
    this.tagInfo = new Tag()

    if (this.tagName) {
      this._packagesServices.getTag(this.package.packageName, this.tagName, GLOBALS.registry.name).subscribe((t) => {

        this.tagInfo = t
        this.haveGitInfo = true
      })
    } else {
      _packagesServices.getPackageManifest(this.package.packageName, this.tagName, GLOBALS.registry.name).subscribe((m) => {
        this.tagInfo.manifest = m
      })
    }
  }

  ngOnInit(): void {
  }

  public isSigned(): boolean {
    if (this.tagInfo.verification) {
      return this.tagInfo.verification.signature != null
    } else {
      return false
    }
  }

  public isVerified(): boolean {
    if (this.tagInfo.verification) {
      return this.tagInfo.verification.verified
    } else {
      return false
    }
  }

  public onNoClick(ref?: any): void {
    this._dialogRef.close(ref)
  }

  public trust(): void {

    // tslint:disable-next-line:max-line-length
    this._packagesServices.trust(this.package.packageName, this.tagName, this.tagInfo.verification != null ? this.tagInfo.verification.signature : null, GLOBALS.registry.name).subscribe((ok) => {

      if (ok) {
        this.onNoClick({added: this.tagName})
      } else {
        const s = this._snackBar.open('Update failed', 'Dismiss', {
          duration: 2000,
        })

        s.afterDismissed().subscribe((a) => {
          this.onNoClick({failed: true})
        })
      }
    })
  }

  public removeTrust(): void {

    this._packagesServices.untrust(this.package.packageName, this.tagName, GLOBALS.registry.name).subscribe((ok) => {

      if (ok) {
        this.onNoClick({removed: this.tagName})
      } else {
        const s = this._snackBar.open('Update failed', 'Dismiss', {
          duration: 2000,
        })

        s.afterDismissed().subscribe((a) => {
          this.onNoClick({failed: true})
        })
      }
    })
  }

  public isAdministrator(): boolean {
    return GLOBALS.isAdministrator()
  }

  public downloadPackage(): void {

    // tslint:disable-next-line:max-line-length
    if (this.tagName) {
      window.open(environment.BASE_API + 'package/' + this.package.packageName + '/' + this.tagName
        + '/download?registry=' + encodeURIComponent(GLOBALS.registry.name) + '&ignoreVerification=true')
    } else {
      window.open(environment.BASE_API + 'package/' + this.package.packageName + '/main/download' +
        '?registry=' + encodeURIComponent(GLOBALS.registry.name) + '&ignoreVerification=true&ignoreSignatureMatch=true')
    }
  }
}
