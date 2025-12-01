import { handleJsonMessage } from '../../handler/jsonHandler'

test('jsonHandler create/get flows', async () => {
  const users: any[] = []
  const repo = {
    addUser: async (name: string) => {
      const u = { id: 'id1', username: name }
      users.push(u)
      return u
    },
    getUserById: async (id: string) => users.find((u) => u.id === id) ?? null,
  }

  const createResp = await handleJsonMessage(repo as any, { action: 'createUser', payload: { name: 'n', email: 'e' } })
  expect(createResp.ok).toBe(true)

  const getResp = await handleJsonMessage(repo as any, { action: 'getUser', payload: { userId: 'id1' } })
  expect(getResp.ok).toBe(true)
  expect(getResp.user).toBeDefined()
})
