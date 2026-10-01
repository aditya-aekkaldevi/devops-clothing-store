import ProductCard from './ProductCard'

export default function ProductGrid({ products, onAddToCart }) {
  return (
    <section>
      <h2 className="section-title">New Arrivals</h2>
      <div className="grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  )
}
