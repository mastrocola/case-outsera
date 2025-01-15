import { api } from '@app'
import { env } from '@config'
import { moviesDB } from '@database'

const initializeApp = async () => {
  moviesDB.loadData(env.DATA_FILE)

  api.listen(env.PORT, () => {
    console.log(`Server is running on http://${env.HOST}:${env.PORT}/${env.PROJECT}/v${env.VERSION}/`)
  })
}

initializeApp()
