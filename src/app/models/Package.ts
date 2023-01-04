
export class Package {
  public packageName: string | undefined
  public registryName: string | undefined
  public description: string | undefined
  public homePage: string | undefined
  public category: string | undefined
  public assetType: string = 'wm-package'
  public owner: string | undefined
  public ownedByMe: boolean  = false
  public searchTags: string[] | undefined
  public registeredDate: string | undefined
  public trustedTags: TagSummary[] | undefined
  public sourceUrl: string | undefined
  public sourcePath: string | undefined
  public sourceIsPrivate: boolean = false
  public sourceHasTokenForEverybody: boolean = false
  public sourceUser: string | undefined
  public totalDownloads: string = '0'
  public recentDownloads: string = '0'
  public private: boolean = false
  public alertEmail: string
  public isVisible: boolean
  public users: string[] = []
  public upVotes: number = 0
  public downVotes: number = 0
  public rating: number = 0
}

export class TagSummary {
  public tag: string | undefined
  public when: string | undefined
  public by: string | undefined
  public signature: string | undefined
}

export class PackageStat {
  constructor(public label: string, public value: number) {

  }

  public scaledValue(scale: number, max: number): number {
    if (this.value > 0) {
      const r: number = (this.value / max) * scale

      return r
    } else {
      return 0
    }
  }
}
