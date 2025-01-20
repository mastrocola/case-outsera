import request from 'supertest'
import { api } from '@app'
import { moviesDB } from '@database'
import { env } from '@config'
import { calculateAwardIntervals, loadMovies } from '@services'

beforeAll(async () => {
  await moviesDB.loadData(env.DATA_FILE)
})

afterAll(() => {
  moviesDB.getDatabase().close()
})

describe('Movies API Integration Tests', () => {
  it('should return a list of all movies', async () => {
    const response = await request(api).get(`/${env.PROJECT}/v${env.VERSION}/movies`)
    const movies = await loadMovies()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(movies)
  })

  it('should return producers awards intervals', async () => {
    const response = await request(api).get(`/${env.PROJECT}/v${env.VERSION}/producers/awards-intervals`)
    const awardIntervals = await calculateAwardIntervals()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(awardIntervals)
  })
})
