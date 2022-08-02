import { Manifest } from './Manifest'

export class Tag {
  public message: string
  public committer: Committer = new Committer()
  public verification: Verification = new Verification()
  public manifest: Manifest = new Manifest()
}

export class Committer {
  public name: string
  public email: string
  public date: string
}

export class Verification {
  public verified: boolean = false
  public reason: string = null
  public signature: string = null
  public payload: string = null
}
