
export enum RegistryType {
  public = 'public',
  private = 'private'
}

export enum TrustLevel {
  wildwest,
  verified_partially,
  verified_only
}

export class Registry {

  public name: string | undefined
  public description: string | undefined
  public legal: string = ''
  public type: RegistryType = RegistryType.public
  public owner: string | undefined
  public searchTags: string[] | undefined
  public trustLevel: TrustLevel | undefined
  public default: boolean = true
}
