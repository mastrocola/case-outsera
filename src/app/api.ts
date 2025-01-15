
import { env } from '@config'
import express, { json } from 'express'
import router from './router'

const startApi = () => {
  const api = express()

  api.use(json())
  api.use(`/${env.PROJECT}/v${env.VERSION}`, router)

  return api
}

export const api = startApi()
