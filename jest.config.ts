import { pathsToModuleNameMapper } from 'ts-jest'

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper({
    "@app": ["app/"],
    "@config": ["config/"],
    "@database": ["database/"]
  }, {
    prefix: '<rootDir>/src/'
  }),
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js'],
  verbose: true,
  cache: false
}
