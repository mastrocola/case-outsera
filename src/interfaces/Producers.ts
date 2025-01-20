export interface AwardsInterval {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}

export interface ProducersAwardsIntervals {
  min: AwardsInterval[]
  max: AwardsInterval[]
}

export interface ProducersWinners {
  year: number
  producers: string
}
