import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'

import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { NotificationsService } from '../services/notifications-service'
import { SettingsService } from '../services/settings.service'
import { GLOBALS } from '../globals'

@Component({
  selector: 'app-login-page',
  templateUrl: './templates/login.component.html',
})
export class LoginComponent implements OnInit {

  @Output()
  public loginModalClose: EventEmitter<boolean> = new EventEmitter()

  public faTimes = faTimes

  public form: UntypedFormGroup
  public userCtrl: UntypedFormControl
  public passwordCtrl: UntypedFormControl
  public isEmpowerLoginCtrl: UntypedFormControl
  public loginType: string = 'Empower'

  public isEmpowerConnectionAvailable: boolean = false
  public connecting: boolean = false
  public submitted: boolean = false
  public failed: boolean = false

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private notificationsService: NotificationsService
  ) {

    settingsService.isEmpowerAvailable().subscribe((available) => {
      this.isEmpowerConnectionAvailable = available
      this.isEmpowerLoginCtrl.setValue(true, {emitEvent: false})
    })
  }

  ngOnInit(): void {

    this.userCtrl = new UntypedFormControl('', Validators.required)
    this.passwordCtrl = new UntypedFormControl('', Validators.required)
    this.isEmpowerLoginCtrl = new UntypedFormControl(false)

    this.form = this.formBuilder.group({
      isEmpowerLoginCtrl: this.isEmpowerLoginCtrl,
      username: this.userCtrl,
      password: this.passwordCtrl
    })

    this.form.valueChanges.subscribe((c) => {
      this.failed = false
    })
  }

  public connect(): void {

    // stop here if form is invalid
    if (this.form.invalid) {
      return
    }

    this.connecting = true
    this.submitted = true

    if (this.isEmpowerLoginCtrl.value) {
      this.settingsService.connectViaEmpower(this.userCtrl.value, this.passwordCtrl.value).subscribe((success) => {

        this.connecting = false

        if (success) {
          GLOBALS.setUser(this.userCtrl.value, null, 'empower')
          this.loginModalClose.emit(true)
        } else {
          GLOBALS.clearUser()
          // this.passwordCtrl.setValue('', {emitEvent: false})
          this.failed = true
        }
      })
    } else {
      this.settingsService.connect(this.userCtrl.value, this.passwordCtrl.value).subscribe((userType) => {

        this.connecting = false

        if (userType) {
          GLOBALS.setUser(this.userCtrl.value, null, userType)
          this.loginModalClose.emit(true)
        } else {
          GLOBALS.clearUser()
          // this.passwordCtrl.setValue('', {emitEvent: false})
          this.failed = true
        }
      })
    }
  }

  public cancel(): void {
    this.loginModalClose.emit(false)
  }

  public isLoginDisabled(): boolean {
    return this.form.invalid || this.connecting
  }

  public styleForLoginButton(): any {

    const style: any = {}
    style['background-color'] = '#1776BF'
    if (this.form.invalid) {
      style['background-color'] = 'lightgray'
    }

    return style
  }

  public styleForConnectButton(): {} {
    if (this.connecting) {
      return {'background-color': 'white', 'border': '2px solid #0f4c7b'}
    }
    else if (this.form.valid) {
      return {}
    } else {
      return {opacity: 0.5}
    }
  }
}
