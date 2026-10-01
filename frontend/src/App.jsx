import { useState, useEffect } from 'react'
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import Cart from './components/Cart'

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => { setError('Failed to load products'); setLoading(false) })
  }, [])

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <div className="app">
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(o => !o)} />
      <main className="main">
        {loading && <p className="status">Loading products...</p>}
        {error && <p className="status error">{error}</p>}
        {!loading && !error && (
          <ProductGrid products={products} onAddToCart={addToCart} />
        )}
      </main>
      {cartOpen && (
        <Cart cart={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} />
      )}
    </div>
  )
}
