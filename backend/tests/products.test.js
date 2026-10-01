const request = require('supertest')
const app = require('../src/index')

describe('GET /api/products', () => {
  it('returns all products', async () => {
    const res = await request(app).get('/api/products')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('filters by category', async () => {
    const res = await request(app).get('/api/products?category=Men')
    expect(res.statusCode).toBe(200)
    expect(res.body.every(p => p.category === 'Men')).toBe(true)
  })
})

describe('GET /api/products/:id', () => {
  it('returns a single product', async () => {
    const res = await request(app).get('/api/products/1')
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(1)
    expect(res.body).toHaveProperty('name')
    expect(res.body).toHaveProperty('price')
  })

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/products/999')
    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty('error')
  })
})

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health')
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})
