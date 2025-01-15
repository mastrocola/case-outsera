import request from 'supertest'
import { api } from '@app'
import { moviesDB } from '@database'
import { env } from '@config'

beforeAll(async () => {
  await moviesDB.loadData(env.DATA_FILE)
})

afterAll(() => {
  moviesDB.getDatabase().close()
})

describe('Movies API Integration Tests', () => {
  it('should return a list of all movies', async () => {
    const response = await request(api).get(`/${env.PROJECT}/v${env.VERSION}/movies`)
    const movies = await moviesDB.getAllMovies()

    expect(response.status).toBe(200)
    expect(response.body.length).toEqual(movies.length)
  })

  it('should return producers award intervals', async () => {
    const response = await request(api).get(`/${env.PROJECT}/v${env.VERSION}/producers/award-intervals`)
    const awardIntervals = await moviesDB.getProducersAwardIntervals()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(awardIntervals)
  })
})
