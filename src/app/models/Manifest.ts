export class Manifest {
  public displayName: string
  public isSystemPackage: string
  public version: string
  public build: string
  public description: string
  public sourceWmVersion: string
  public targetWmVersion: string
  public lastUpdated: string
  public packageArchiveType: string
  public packagePublisher: string

  public requires: Require[] = []
}

export class Require {
  public package: string
  public version: string
}
