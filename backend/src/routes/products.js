const express = require('express')
const router = express.Router()
const products = require('../data/products')

// GET /api/products
router.get('/', (req, res) => {
  const { category } = req.query
  const result = category
    ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : products
  res.json(result)
})

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id))
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

module.exports = router
