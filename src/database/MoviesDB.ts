import { AwardsInterval, Movie, ProducersAwardsIntervals, ProducersWinners } from '@interfaces'
import csvParser from 'csv-parser'
import fs from 'fs'
import { Database } from 'sqlite3'

class MoviesDB {
  private static instance: MoviesDB
  private db: Database

  private constructor() {
    this.db = new Database(':memory:')

    this.createTable()
  }

  public static getInstance(): MoviesDB {
    if (!MoviesDB.instance) {
      MoviesDB.instance = new MoviesDB()
    }

    return MoviesDB.instance
  }

  private addMovie(movie: Omit<Movie, 'id'>): void {
    this.db.run(`INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)`,
      [movie.year, movie.title, movie.studios, movie.producers, movie.winner])
  }

  private createTable(): void {
    this.db.run(`
        CREATE TABLE movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            year INTEGER,
            title VARCHAR(100),
            studios VARCHAR(100),
            producers VARCHAR(100),
            winner BOOLEAN
        )
    `)
  }

  public async getAllMovies(): Promise<Movie[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM movies', (err, rows) => {
        if (err) reject(err)

        resolve(rows as Movie[])
      })
    })
  }

  public getDatabase(): Database {
    return this.db
  }

  public async loadData(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';' }))
        .on('data', row => {
          const movie = {
            year: parseInt(row.year),
            title: row.title,
            studios: row.studios,
            producers: row.producers,
            winner: row.winner === 'yes'
          }

          this.addMovie(movie)
        })
        .on('end', () => resolve())
        .on('error', error => reject(error))
    })
  }

  public async getProducersWinners(): Promise<ProducersWinners[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT year, producers FROM movies WHERE winner', (err, rows) => {
        if (err) reject(err)
  
        resolve(rows as ProducersWinners[])
      })
    })
  }
}

export const moviesDB = MoviesDB.getInstance()
