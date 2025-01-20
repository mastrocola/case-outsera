import { pathsToModuleNameMapper } from 'ts-jest'

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper({
    "@app": ["app/"],
    "@config": ["config/"],
    "@database": ["database/"],
    "@interfaces": ["interfaces/"],
    "@services": ["services/"]
  }, {
    prefix: '<rootDir>/src/'
  }),
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js'],
  verbose: true,
  cache: false
}
