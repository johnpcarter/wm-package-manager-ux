import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { GLOBALS } from '../globals'

@Component({
  selector: 'app-login-page',
  templateUrl: './templates/login-page.component.html',
})
export class LoginPageComponent implements OnInit {

  private registry: string = null
  private package: string = null

  // tslint:disable-next-line:variable-name
  constructor(private _router: Router, private route: ActivatedRoute) {

    GLOBALS.currentPage = 'login'

    this.route.params.subscribe((params: Params) => {
      this.registry = (params as any).registry
      this.package = (params as any).package
    })
  }

  ngOnInit(): void {
  }

  public showRegistries(): boolean {
    GLOBALS.currentPage = 'registries'
    this._router.navigate(['/registries'], {skipLocationChange: true})

    return false
  }

  public onConnectionDialogClose(result): void {

    if (result) {
      GLOBALS.currentPage = 'packages'

      if (this.registry !== undefined) {
        this._router.navigate(['/packages', this.registry])
      } else {
        this._router.navigate(['/packages'])
      }
    }
  }
}
