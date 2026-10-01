const express = require('express')
const router = express.Router()
const client = require('prom-client')

// Auto-collect default Node.js metrics (CPU, memory, event loop lag)
const register = new client.Registry()
client.collectDefaultMetrics({ register })

// Custom counter: total HTTP requests
const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
})

// Custom histogram: response duration
const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1],
  registers: [register],
})

// Expose counters for middleware use
module.exports.httpRequests = httpRequests
module.exports.httpDuration = httpDuration

// GET /metrics — scraped by Prometheus
router.get('/', async (_req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

module.exports.router = router
