import { moviesDB } from '@database'
import { Movie } from '@interfaces'

export const loadMovies = async (): Promise<Movie[]> => {
  return moviesDB.getAllMovies()
}
