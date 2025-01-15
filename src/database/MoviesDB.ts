import csvParser from 'csv-parser'
import fs from 'fs'
import { Database } from 'sqlite3'

interface Movie {
  year: number
  title: string
  studios: string
  producers: string
  winner: boolean
}

interface ProducersAwards {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}

interface ProducersAwardsInterval {
  min: ProducersAwards[]
  max: ProducersAwards[]
}

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

  private addMovie(movie: Movie): void {
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

  public async getProducersAwardIntervals(): Promise<ProducersAwardsInterval> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT year, producers FROM movies WHERE winner', (err, rows: Movie[]) => {
        if (err) reject(err)
  
        const producerWins: Record<string, number[]> = {}
  
        rows.forEach(row => {
          const year = row.year
          const producersString = row.producers.replaceAll(' and', ',')
          const producers: string[] = producersString.split(',').map(p => p.trim())

          producers.forEach(producer => {
            if (!producerWins[producer]) {
              producerWins[producer] = []
            }
            producerWins[producer].push(year)
          })
        })
  
        const intervals: ProducersAwards[] = []
  
        Object.entries(producerWins).forEach(([producer, years]) => {
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
  
        resolve({ min, max })
      })
    })
  }
}

export const moviesDB = MoviesDB.getInstance()
