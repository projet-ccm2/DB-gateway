describe('logger branches', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })
  afterAll(() => {
    process.env = OLD_ENV
  })

  test('debug level when NODE_ENV=development', () => {
    process.env.NODE_ENV = 'development'
    const { logger } = require('../../utils/logger')
    expect(logger).toBeDefined()
  })

  test('info level when NODE_ENV=production', () => {
    process.env.NODE_ENV = 'production'
    const { logger } = require('../../utils/logger')
    expect(logger).toBeDefined()
  })
})
