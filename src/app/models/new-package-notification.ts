export class NewPackageNotification {

  public registry: string

  constructor(public name: string, public isPackage: boolean, public friendlyName: string, public email: string) {

  }
}
