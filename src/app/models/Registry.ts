
export enum RegistryType {
  public = 'public',
  private = 'private'
}

export class Registry {

  public name: string = 'undefined'
  public description: string | undefined
  public type: RegistryType = RegistryType.public
  public owner: string | undefined
  public searchTags: string[] | undefined
  public trustLevel: number | undefined
  public default: boolean = true
}
