
import { calculateAwardIntervals, loadMovies } from '@services'
import { Router } from 'express'

const router = Router()

router.get('/movies', async (_, res) => {
  try {
    const movies = await loadMovies()

    res.json(movies)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/producers/awards-intervals', async (_, res) => {
  try {
    const awardsIntervals = await calculateAwardIntervals()

    res.json(awardsIntervals)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
