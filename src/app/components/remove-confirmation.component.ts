import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-remove-asset',
  templateUrl: './templates/remove-confirm.component.html'
})
export class RemoveConfirmationComponent implements OnInit {

  public faTrashAlt = faTrashAlt
  public faTimes = faTimes

  public ref: string

  // tslint:disable-next-line:variable-name
  private _dialogRef: MatDialogRef<any>

  // tslint:disable-next-line:variable-name max-line-length
  constructor(dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this._dialogRef = dialogRef
    this.ref = data.ref
  }

  ngOnInit(): void {
  }

  public onNoClick(): void {
    this._dialogRef.close()
  }


  public confirm(): void {
    this._dialogRef.close({confirm: true})
  }
}
