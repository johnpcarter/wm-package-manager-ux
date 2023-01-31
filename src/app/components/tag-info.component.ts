import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'

import { faThumbsUp, faThumbsDown, faTimes, faClock, faUser, faEnvelope, faStamp, faSignature, faCheckCircle, faQuestionCircle,
                faArrowCircleDown, faExclamationTriangle, faBox } from '@fortawesome/free-solid-svg-icons'
import { faGitAlt } from '@fortawesome/free-brands-svg-icons'

import { Tag } from '../models/Tag'
import {Package, TagSummary} from '../models/Package';

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
  public tagInfo: TagSummary
  public tagDetails: Tag

  public haveGitInfo: boolean = false
  public hasAccessToken: boolean = false
  public registryName: string
  public isDefaultRegistry: boolean = false
  public userName: string

  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name max-line-length
  constructor(dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private _packagesServices: PackagesServices) {

    this._dialogRef = dialogRef
    this.package = data.package
    this.tagInfo = data.tag

    this.tagDetails = new Tag()

    if (this.tagInfo.tag) {
      this._packagesServices.getTag(this.package.packageName, this.tagInfo.tag, GLOBALS.registry.name).subscribe((t) => {

        this.tagDetails = t
        this.haveGitInfo = true
      })
    } else {
      _packagesServices.getPackageManifest(this.package.packageName, this.tagInfo.tag, GLOBALS.registry.name).subscribe((m) => {
        this.tagDetails.manifest = m
      })
    }
  }

  ngOnInit(): void {

    this.userName = GLOBALS.user
    this.registryName = GLOBALS.registry.name
    this.isDefaultRegistry = GLOBALS.registry.default

    this.hasAccessToken = GLOBALS.getAccessToken() != null
  }

  public isSigned(): boolean {
    if (this.tagDetails.verification) {
      return this.tagDetails.verification.signature != null
    } else {
      return false
    }
  }

  public isVerified(): boolean {
    if (this.tagDetails.verification) {
      return this.tagDetails.verification.verified
    } else {
      return false
    }
  }

  public onNoClick(ref?: any): void {
    this._dialogRef.close(ref)
  }

  public trust(): void {

    // tslint:disable-next-line:max-line-length
    this._packagesServices.trust(this.package.packageName, this.tagInfo.tag, this.tagDetails.verification != null ? this.tagDetails.verification.signature : null, GLOBALS.registry.name).subscribe((ok) => {

      if (ok) {
        this.tagInfo.when = 'today'
        this.tagInfo.by = GLOBALS.user
        this.tagInfo.trust = 'TRUSTED'

        this.onNoClick({added: this.tagInfo.tag})
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

    this._packagesServices.untrust(this.package.packageName, this.tagInfo.tag, GLOBALS.registry.name).subscribe((ok) => {

      if (ok) {
        this.tagInfo.by = null
        this.tagInfo.when = null
        this.tagInfo.trust = 'NOT_TRUSTED'
        this.onNoClick({removed: this.tagInfo.tag})
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

    let url: string = environment.BASE_API + 'package/' + this.package.packageName

    // tslint:disable-next-line:max-line-length
    if (this.tagInfo.tag) {
      url += '/' + this.tagInfo.tag
    } else {
      url = '/main'
    }

    url += '/download?ignoreVerification=true&ignoreSignatureMatch=true'

    if (!GLOBALS.registry.default) {
      url += '&registry=' + encodeURIComponent(GLOBALS.registry.name)
    }

    window.open(url)
  }
}
