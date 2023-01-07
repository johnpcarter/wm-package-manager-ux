import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { faTimes, faRocket } from '@fortawesome/free-solid-svg-icons'

import { RegistriesService } from '../services/registries.service'
import { Registry } from '../models/Registry'

@Component({
  selector: 'app-remove-asset',
  templateUrl: './templates/list-registries.component.html'
})
export class ListRegistriesComponent implements OnInit {

  public faRocket = faRocket
  public faTimes = faTimes

  public ref: string
  public registry: string = null
  public omitRegistry: string = null
  public registries: Registry[]

  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name max-line-length
  constructor(dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private _registriesService: RegistriesService) {
    this._dialogRef = dialogRef
    this.omitRegistry = data.omitRegistry || ''
    this.ref = data.ref

    this._registriesService.registries().subscribe((r) => {

      this.registries = []

      r.forEach((rp) => {
        if ((this.omitRegistry !== '' && rp.name !== this.omitRegistry) || (this.omitRegistry === '' && !rp.default)) {
          this.registries.push(rp)
        }
      })
    })
  }

  ngOnInit(): void {
  }

  public onNoClick(): void {
    this._dialogRef.close()
  }


  public confirm(): void {
    this._dialogRef.close({registry: this.registry})
  }
}
