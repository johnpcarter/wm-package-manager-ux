
export class Package {
  public name: string | undefined
  public description: string | undefined
  public category: string | undefined
  public owner: string | undefined
  public ownedByMe: boolean  = false
  public searchTags: string[] | undefined
  public registeredDate: string | undefined
  public availableTags: string[] | undefined
  public trustedTags: TagSummary[] | undefined
  public homepage: string | undefined
  public lastUpdated: string | undefined
  public watchers: string | undefined
  public stargazers: string | undefined
  public sourceUrl: string | undefined
  public sourceIsPrivate: boolean = false
  public sourceUser: string | undefined
  public totalDownloads: string = '0'
  public recentDownloads: string = '0'
  public private: boolean = false
  public users: string[] = []
}

export class TagSummary {
  public tag: string | undefined
  public when: string | undefined
  public by: string | undefined
  public signature: string | undefined
}
