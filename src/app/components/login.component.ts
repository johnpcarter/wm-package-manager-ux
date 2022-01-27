import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators}  from '@angular/forms'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { SettingsService } from '../services/settings.service'
import {MatDialogRef} from '@angular/material/dialog';
import {GLOBALS} from '../globals';

@Component({
  selector: 'app-login-page',
  templateUrl: './templates/login.component.html',
})
export class LoginComponent implements OnInit {

  public faTimes = faTimes

  public form: FormGroup
  public userCtrl: FormControl
  public passwordCtrl: FormControl

  public connecting: boolean = false
  public submitted: boolean = false
  public failed: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialogRef: MatDialogRef<any>,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {

    this.userCtrl = new FormControl('', Validators.required)
    this.passwordCtrl = new FormControl('', Validators.required)

    this.form = this.formBuilder.group({
      username: this.userCtrl,
      password: this.passwordCtrl
    })
  }

  public connect(): void {

    // stop here if form is invalid
    if (this.form.invalid) {
      return
    }

    this.connecting = true
    this.submitted = true

    this.settingsService.connect(this.userCtrl.value, this.passwordCtrl.value).subscribe((success) => {

      this.connecting = false

      if (success) {
        GLOBALS.user = this.userCtrl.value
        this.dialogRef.close()
      } else {
        GLOBALS.user = null
        this.failed = true
      }
    })
  }

  public onNoClick(): void {
    this.dialogRef.close()
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