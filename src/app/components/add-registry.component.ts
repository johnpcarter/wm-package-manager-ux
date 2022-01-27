import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

import {faBook, faTimes} from '@fortawesome/free-solid-svg-icons';

import {RegistriesService} from '../services/registries.service';
import {Registry, RegistryType} from '../models/Registry';

@Component({
  selector: 'app-add-registry',
  templateUrl: './templates/add-registry.component.html'
})
export class AddRegistryComponent implements OnInit {

  public faBook = faBook
  public faTimes = faTimes

  public form: FormGroup
  public nameCtrl: FormControl
  public descriptionCtrl: FormControl
  public typeCtrl: FormControl
  public trustLevelCtrl: FormControl
  public isDefaultCtrl: FormControl

  public failed: boolean = false

  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name max-line-length
  constructor(private formBuilder: FormBuilder, dialogRef: MatDialogRef<any>, private _registriesService: RegistriesService) {
    this._dialogRef = dialogRef

    this.nameCtrl = new FormControl('', Validators.required)
    this.descriptionCtrl = new FormControl('', Validators.required)
    this.typeCtrl = new FormControl('', Validators.required)
    this.trustLevelCtrl = new FormControl('', Validators.required)
    this.isDefaultCtrl = new FormControl()

    this.form = this.formBuilder.group({
      name: this.nameCtrl,
      description: this.descriptionCtrl,
      type: this.typeCtrl,
      trustLevel: this.trustLevelCtrl,
      isDefault: this.isDefaultCtrl
    })
  }

  ngOnInit(): void {
  }

  public onNoClick(): void {
    this._dialogRef.close()
  }

  public toggleIsDefault(): void {
    this.isDefaultCtrl.setValue(!this.isDefaultCtrl.value, {onlySelf: true})
  }

  public submit(): void {

    const r = new Registry()
    r.name = this.nameCtrl.value
    r.description = this.descriptionCtrl.value
    r.type = RegistryType[this.typeCtrl.value]
    r.trustLevel = this.trustLevelCtrl.value
    r.default = this.isDefaultCtrl.value

    this._registriesService.createRegistry(r).subscribe((success) => {
      if (success) {
        this._dialogRef.close()
      } else {
        this.failed = true
      }
    })
  }
}
