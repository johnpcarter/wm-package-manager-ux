export class Tag {
  public message: string
  public committer: Committer
  public verification: Verification
}

export class Committer {
  public name: string
  public email: string
  public date: string
}

export class Verification {
  public verified: boolean
  public reason: string
  public signature: string
  public payload: string
}
