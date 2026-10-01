const express = require('express')
const cors = require('cors')
const productsRouter = require('./routes/products')
const { router: metricsRouter, httpRequests, httpDuration } = require('./routes/metrics')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Middleware: track request count and duration for Prometheus
app.use((req, res, next) => {
  const end = httpDuration.startTimer({ method: req.method, route: req.path })
  res.on('finish', () => {
    httpRequests.inc({ method: req.method, route: req.path, status: res.statusCode })
    end()
  })
  next()
})

app.use('/api/products', productsRouter)
app.use('/metrics', metricsRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
}

module.exports = app
