import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'

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

  public form: FormGroup
  public userCtrl: FormControl
  public passwordCtrl: FormControl
  public isEmpowerLoginCtrl: FormControl
  public loginType: string = 'Empower'

  public isEmpowerConnectionAvailable: boolean = false
  public connecting: boolean = false
  public submitted: boolean = false
  public failed: boolean = false

  constructor(
    private formBuilder: FormBuilder,
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

    this.userCtrl = new FormControl('', Validators.required)
    this.passwordCtrl = new FormControl('', Validators.required)
    this.isEmpowerLoginCtrl = new FormControl(false)

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
          GLOBALS.setUser(this.userCtrl.value, this.notificationsService, 'empower')
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
          GLOBALS.setUser(this.userCtrl.value, this.notificationsService, userType)
          this.loginModalClose.emit(true)
        } else {
          GLOBALS.clearUser()
          // this.passwordCtrl.setValue('', {emitEvent: false})
          this.failed = true
        }
      })
    }
  }

  public onNoClick(): void {
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
}
