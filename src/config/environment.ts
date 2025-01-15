import dotenv from 'dotenv'

interface Environment {
  DATA_FILE: string
  HOST: string
  PORT: number
  PROJECT: string
  VERSION: number
}

const loadEnvironmentVariables = () => {
  dotenv.config()

  const env: Environment = {
    DATA_FILE: process.env.DATA_FILE!,
    HOST: process.env.HOST!,
    PORT: parseInt(process.env.PORT!),
    PROJECT: process.env.PROJECT!,
    VERSION: parseInt(process.env.VERSION!)
  }

  Object.keys(env).forEach(key => {
    const parameter = key as keyof Environment

    if (!env[parameter]) throw new Error(`Environment variable ${key} is missing`)
  })

  return env
}

export const env = loadEnvironmentVariables()
