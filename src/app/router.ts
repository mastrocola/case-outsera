import { moviesDB } from '@database'
import { Router } from 'express'

const router = Router()

router.get('/movies', async (_, res) => {
  res.json(await moviesDB.getAllMovies())
})

router.get('/producers/award-intervals', async (_, res) => {
  res.json(await moviesDB.getProducersAwardIntervals())
})

export default router
