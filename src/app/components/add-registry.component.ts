import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'

import { faBook, faTimes } from '@fortawesome/free-solid-svg-icons'

import { RegistriesService } from '../services/registries.service'
import { Registry, RegistryType } from '../models/Registry'

@Component({
  selector: 'app-add-registry',
  templateUrl: './templates/add-registry.component.html'
})
export class AddRegistryComponent implements OnInit {

  public faBook = faBook
  public faTimes = faTimes

  public form: UntypedFormGroup
  public nameCtrl: UntypedFormControl
  public descriptionCtrl: UntypedFormControl
  public typeCtrl: UntypedFormControl
  public trustLevelCtrl: UntypedFormControl
  public isDefaultCtrl: UntypedFormControl

  public failed: boolean = false

  @Output()
  public onCompleted: EventEmitter<boolean> = new EventEmitter<boolean>()

  // tslint:disable-next-line:variable-name max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private _registriesService: RegistriesService) {

    this.nameCtrl = new UntypedFormControl('', Validators.required)
    this.descriptionCtrl = new UntypedFormControl('', Validators.required)
    this.typeCtrl = new UntypedFormControl('', Validators.required)
    this.trustLevelCtrl = new UntypedFormControl('', Validators.required)
    this.isDefaultCtrl = new UntypedFormControl()

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
        this.onCompleted.emit(success)
      } else {
        this.failed = true
      }
    })
  }

  public close():void {
    this.onCompleted.emit(false)
  }
}
