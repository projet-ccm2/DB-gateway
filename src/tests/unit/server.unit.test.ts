import request from 'supertest'
import app from '../../server'

describe('server (unit) - mock-backed', () => {
  test('POST /users creates a user and GET /users/:id returns it', async () => {
    const resp = await request(app).post('/users').send({ username: 'testuser' })
    expect(resp.status).toBe(201)
    expect(resp.body).toHaveProperty('id')
    expect(resp.body.username).toBe('testuser')

    const id = resp.body.id
    const getResp = await request(app).get(`/users/${id}`)
    expect(getResp.status).toBe(200)
    expect(getResp.body.id).toBe(id)
    expect(getResp.body.username).toBe('testuser')
  })
})
