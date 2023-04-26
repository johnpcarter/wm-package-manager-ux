import { Component, EventEmitter, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-login-modal',
  templateUrl: './templates/login-modal.component.html',
})
export class LoginModalComponent implements OnInit {

  @Output()
  public loginModalClose: EventEmitter<boolean> = new EventEmitter()

  ngOnInit(): void {
  }

  public cancel(): void {
    if (this.loginModalClose != null) {
      this.loginModalClose.emit(null)
    }
  }
  public onConnectionDialogClose(result): void {

    if (this.loginModalClose != null) {
      this.loginModalClose.emit(result)
    }
  }
}
