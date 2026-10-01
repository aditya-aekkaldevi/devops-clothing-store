export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="card">
      <div className="card-img-wrap">
        <img src={product.image} alt={product.name} className="card-img" />
        {product.badge && <span className="badge">{product.badge}</span>}
      </div>
      <div className="card-body">
        <p className="card-category">{product.category}</p>
        <h3 className="card-name">{product.name}</h3>
        <div className="card-footer">
          <span className="card-price">${product.price}</span>
          <button className="add-btn" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
