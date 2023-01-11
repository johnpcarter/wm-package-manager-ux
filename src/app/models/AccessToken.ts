
export class AccessToken {
  public label: string
  public createdOn: string
  public expiresOn: string
  public token: string | undefined
  public userID: string | undefined
  public userType: string = 'Anonymous'

  constructor(label?: string, token?: string, numDays?: number) {
    this.label = label
    this.createdOn = new Date().toDateString()
    this.token = token

    if (numDays) {
      const adjustedDate: Date = new Date()
      adjustedDate.setDate(new Date().getDate() + numDays)

      this.expiresOn = adjustedDate.toDateString()
    }
  }
}
