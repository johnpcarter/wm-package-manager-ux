import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'

import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { NotificationsService } from '../services/notifications-service'
import { SettingsService } from '../services/settings.service'
import { GLOBALS } from '../globals'

@Component({
  selector: 'app-login',
  templateUrl: './templates/login.component.html',
})
export class LoginComponent implements OnInit {

  @Input()
  public showCancelButton: boolean = true

  @Output()
  public loginModalClose: EventEmitter<boolean> = new EventEmitter()

  public faTimes = faTimes

  public form: UntypedFormGroup
  public userCtrl: UntypedFormControl
  public passwordCtrl: UntypedFormControl
  public isEmpowerLoginSelected: boolean = true

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
      this.isEmpowerConnectionAvailable = available
    })
  }

  ngOnInit(): void {

    this.userCtrl = new UntypedFormControl('', Validators.required)
    this.passwordCtrl = new UntypedFormControl('', Validators.required)

    this.form = this.formBuilder.group({
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

    if (this.isEmpowerLoginSelected) {
      this.settingsService.connectViaEmpower(this.userCtrl.value, this.passwordCtrl.value).subscribe((response) => {

        this.connecting = false

        if (response) {
          GLOBALS.setUser(response.userID, null, response.userType)
          GLOBALS.cacheAccessToken(response.token)

          this.loginModalClose.emit(true)
        } else {
          GLOBALS.clearUser()
          this.failed = true
        }
      })
    } else {
      this.settingsService.connect(this.userCtrl.value, this.passwordCtrl.value).subscribe((response) => {

        this.connecting = false

        if (response) {
          GLOBALS.setUser(response.userID, null, response.userType)
          this.loginModalClose.emit(true)
        } else {
          GLOBALS.clearUser()
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

  public switchToLocalLogin(): void {
    this.isEmpowerLoginSelected = false
  }

  public switchToEmpowerLogin(): void {
    this.isEmpowerLoginSelected = true
  }
}
