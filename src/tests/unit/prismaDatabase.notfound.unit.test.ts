// @ts-nocheck
describe('prismaDatabase not-found branches', () => {
  jest.isolateModules(() => {
    jest.doMock('../../generated/prisma/client', () => {
      return {
        PrismaClient: class {
          constructor() {
            this.user = { findUnique: async () => null }
            this.chanel = { findUnique: async () => null }
            this.typeAchievement = { findUnique: async () => null }
            this.achievement = { findUnique: async () => null }
            this.badge = { findUnique: async () => null }
            this.achieved = { findUnique: async () => null }
            this.are = { findUnique: async () => null }
            this.possesses = { findUnique: async () => null }
            this.$disconnect = async () => {}
          }
        }
      }
    })

    const { prismaDatabase } = require('../../database/prismaDatabase')
    test('all gets return null for missing entries', async () => {
      const db = new prismaDatabase()
      expect(await db.getUserById('no')).toBeNull()
      expect(await db.getChanelById('no')).toBeNull()
      expect(await db.getTypeAchievementById('no')).toBeNull()
      expect(await db.getAchievementById('no')).toBeNull()
      expect(await db.getBadgeById('no')).toBeNull()
      expect(await db.getAchieved('no','no')).toBeNull()
      expect(await db.getAre('no','no')).toBeNull()
      expect(await db.getPossesses('no','no')).toBeNull()
      await db.disconnect()
    })
  })
})
