import { moviesDB } from '@database'
import { AwardsInterval, ProducersAwardsIntervals } from '@interfaces'

export const calculateAwardsIntervals = async (): Promise<ProducersAwardsIntervals> => {
  const producersWinners = await moviesDB.getProducersWinners()
  const wins: Record<string, number[]> = {}

  producersWinners.forEach(row => {
    const year = row.year
    const producersString = row.producers.replaceAll(' and', ',')
    const producers: string[] = producersString.split(',').map(p => p.trim())

    producers.forEach(producer => {
      if (!wins[producer]) {
        wins[producer] = []
      }
      wins[producer].push(year)
    })
  })

  const intervals: AwardsInterval[] = []

  Object.entries(wins).forEach(([producer, years]) => {
    years.sort((a, b) => a - b)

    for (let i = 1; i < years.length; i++) {
      intervals.push({
        producer,
        interval: years[i] - years[i - 1],
        previousWin: years[i - 1],
        followingWin: years[i],
      })
    }
  })

  const minInterval = Math.min(...intervals.map(i => i.interval))
  const maxInterval = Math.max(...intervals.map(i => i.interval))

  const min = intervals.filter(i => i.interval === minInterval)
  const max = intervals.filter(i => i.interval === maxInterval)

  return { min, max }
}
